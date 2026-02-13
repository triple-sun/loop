#!/bin/bash

# Ensure we are in the project root
cd "$(dirname "$0")/.."

OUTDIR="test/real-api/schemas"

echo "🚀 Starting Real API Schema Generation..."

for FILE in src/types/general.ts \
	src/types/common.ts \
	src/types/posts.ts \
	src/types/responses/posts.responses.ts \
	src/types/teams.ts \
	src/types/apps.ts \
	src/types/responses/common.responses.ts \
	src/types/channels.ts \
	src/types/metadata.ts \
	src/types/emojis.ts \
	src/types/files.ts \
	src/types/plugins.ts \
	src/types/roles.ts \
	src/types/users.ts; do

	if [ ! -f "$FILE" ]; then
		echo "FILE $FILE NOT FOUND!"
		exit 1
	fi

	FILENAME=$(basename $FILE .ts)
	OUTFILE="${OUTDIR}/$FILENAME.zod.ts"
	TYPEFILE="${OUTDIR}/$FILENAME.ts"

	if [ ! -f "$OUTFILE" ]; then
		echo "🚀 File $OUTFILE does not exist. Creating it now."
		touch "$OUTFILE"
		echo "✔ New OUTFILE was created: $OUTFILE"
	else
		echo "✖ Removing old $FILENAME OUTFILE..."
		rm -rf "$OUTFILE"
		echo "✔ Old OUTFILE removed"
	fi

	if [ ! -f "$TYPEFILE" ]; then
		echo "🚀 File $TYPEFILE does not exist. Creating it now."
		touch "$TYPEFILE"
		echo "✔ New TYPEFILE was created: $TYPEFILE"
	else
		echo "✖ Removing old $FILENAME TYPEFILE..."
		rm -rf "$TYPEFILE"
		echo "✔ Old TYPEFILE removed"
	fi

	echo "Copying types to typefile: $TYPEFILE..."
	cat $FILE >>"$TYPEFILE"
	echo "✔ Type contents copied successfully!"

	echo "Fixing generics..."

	# apps fix
	if [[ "$FILENAME" = "apps" ]]; then
		echo "Fixing apps generics"
		# Remove generic definitions
		perl -0777 -pi -e 's/<PROPS_TYPE = Record<string, unknown>>//g' "$TYPEFILE"
		perl -0777 -pi -e 's/<STATE = Record<string, unknown>>//g' "$TYPEFILE"
		perl -0777 -pi -e 's/<VALUES = Record<string, unknown>>//g' "$TYPEFILE"
		perl -0777 -pi -e 's/<RESPONSE = unknown>//g' "$TYPEFILE"
		perl -0777 -pi -e 's/<SUBMIT_STATE = Record<string, unknown>>//g' "$TYPEFILE"

		# Remove multi-line generic definition in AppForm
		perl -0777 -pi -e 's/<\n\tSOURCE_STATE = Record<string, unknown>,\n\tSUBMIT_STATE = Record<string, unknown>\n>//g' "$TYPEFILE"

		# Replace generic usages
		perl -0777 -pi -e 's/: PROPS_TYPE/: any/g' "$TYPEFILE"
		perl -0777 -pi -e 's/: STATE/: any/g' "$TYPEFILE"
		perl -0777 -pi -e 's/: VALUES/: any/g' "$TYPEFILE"
		perl -0777 -pi -e 's/: RESPONSE/: any/g' "$TYPEFILE"
		perl -0777 -pi -e 's/AppCall<SUBMIT_STATE>/AppCall<any>/g' "$TYPEFILE"
		perl -0777 -pi -e 's/AppCall<SOURCE_STATE>/AppCall<any>/g' "$TYPEFILE"
	fi

	# posts fix
	if [[ "$FILENAME" = "posts" || "$FILENAME" = "posts.responses" ]]; then
		echo "Fixing posts generics"
		
		# Handle multi-line PostActionResponsePayload definition
		perl -0777 -pi -e 's/PostActionResponsePayload\s*<\s*PROP_METADATA\s*=\s*Record<string,\s*unknown>\s*>/PostActionResponsePayload/g' "$TYPEFILE"

		perl -0777 -pi -e 's/<PROP_METADATA = undefined>//g' "$TYPEFILE"
		perl -0777 -pi -e 's/<PROP_METADATA>//g' "$TYPEFILE"
		perl -0777 -pi -e 's/<PROP_METADATA = Record<string, unknown>>//g' "$TYPEFILE"
		perl -0777 -pi -e 's/PROP_METADATA/unknown/g' "$TYPEFILE"

		perl -0777 -pi -e 's/<CONTEXT = Record<string, unknown>>//g' "$TYPEFILE"
		perl -0777 -pi -e 's/<CONTEXT>//g' "$TYPEFILE"
		perl -0777 -pi -e 's/CONTEXT/unknown/g' "$TYPEFILE"
		
		sed -i '' 's/{ AppBinding }/{}/g' "$TYPEFILE"
		sed -i '' 's/AppBinding/any/g' "$TYPEFILE"
		sed -i '' 's/{ UserProfile }/{}/g' "$TYPEFILE"
		sed -i '' 's/UserProfile/any/g' "$TYPEFILE"
		sed -i '' 's/any["id"]/any/g' "$TYPEFILE"
		sed -i '' 's/channel_type: ChannelType/channel_type: string/g' "$TYPEFILE"
		sed -i '' 's/team_type: TeamType/team_type: string/g' "$TYPEFILE"
		sed -i '' 's|\.\.|.|g' "$TYPEFILE"
	fi

	# channels fix
	if [ "$FILENAME" = "channels" ]; then
		sed -i '' 's/file: FileInfo/file?: FileInfo/g' "$TYPEFILE"
	fi

	sed -i '' 's/<RESPONSE = unknown>//g' "$TYPEFILE"
	sed -i '' 's/RESPONSE/any/g' "$TYPEFILE"

	sed -i '' 's/AppFormField<string>,/AppFormField,/g' "$TYPEFILE"
	sed -i '' 's/AppFormField<boolean>,/AppFormField,/g' "$TYPEFILE"
	sed -i '' 's/AppFormField<AppFormFieldOption>,/AppFormField,/g' "$TYPEFILE"
	sed -i '' 's/AppFormField<string>,/AppFormField,/g' "$TYPEFILE"
	sed -i '' 's/extends AppFormField<string>//g' "$TYPEFILE"


	# teams fix
	sed -i '' 's/{ ServerError }/{}/g' "$TYPEFILE"
	sed -i '' 's/<T>//g' "$TYPEFILE"
	sed -i '' 's/$T$/any/g' "$TYPEFILE"

	sed -i '' 's|AppCall<any>|AppCall|g' "$TYPEFILE"
	
	echo "✔ Generics fixed!"

	npx ts-to-zod "$TYPEFILE" "$OUTFILE"

	sleep 1

	if [[ "$FILENAME" = "posts" || "$FILENAME" = "posts.responses" ]]; then
		echo "Fixing $FILENAME OUTFILE: $OUTFILE"

		sed -i '' 's/postSchema.partial()/postSchema/g' "$OUTFILE"
		sed -i '' 's|import type { TeamType } from "./teams";||g' "$OUTFILE"
		sed -i '' 's|import type { ChannelType } from "./channels"||g' "$OUTFILE"
		sed -i '' 's|dataSourceSchema.shape|dataSourceSchema|g' "$OUTFILE"
		sed -i '' 's|optionsSchema.shape|optionsSchema|g' "$OUTFILE"

		sed -i '' 's|postAttachmentSchema.extend|z.object|g' "$OUTFILE"
		sed -i '' 's|postPropsSchema.extend|z.object|g' "$OUTFILE"
		sed -i '' 's|postSchema.extend|z.object|g' "$OUTFILE"

		sed -i '' 's|const postSchema = z.any();||g' "$OUTFILE"

		sed -i '' 's|postActionBaseSchema.extend|postActionBaseSchema|g' "$OUTFILE"
		echo "Fixed $FILENAME OUTFILE!"
	fi

	sleep 1
done

echo "✅ Done!"
