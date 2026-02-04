#!/bin/bash

# Ensure we are in the project root
cd "$(dirname "$0")/.."

OUTDIR="test/integration/real-api/schemas"

echo "🚀 Starting Real API Schema Generation..."

for FILE in \
	src/types/posts.ts \
	src/types/teams.ts \
	src/types/apps.ts \
	src/types/responses/common.responses.ts \
	src/types/responses/posts.responses.ts \
	src/types/bots.ts \
	src/types/channels.ts \
	src/types/metadata.ts \
	src/types/emojis.ts \
	src/types/files.ts \
	src/types/plugins.ts \
	src/types/preferences.ts \
	src/types/reactions.ts \
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
	# posts fix
	if [[ "$FILENAME" = "posts" || "$FILENAME" = "posts.responses" ]]; then
		echo "Fixing posts generics"
		sed -i '' 's/<PROP_METADATA = undefined>//g' "$TYPEFILE"
		sed -i '' 's/<PROP_METADATA>//g' "$TYPEFILE"
		sed -i '' 's/<PROP_METADATA = Record<string, unknown>>//g' "$TYPEFILE"
		sed -i '' 's/PROP_METADATA/unknown/g' "$TYPEFILE"

		sed -i '' 's/<CONTEXT = Record<string, unknown>>//g' "$TYPEFILE"
		sed -i '' 's/<CONTEXT>//g' "$TYPEFILE"
		sed -i '' 's/CONTEXT/unknown/g' "$TYPEFILE"

		sed -i '' 's/{ AppBinding }/{}/g' "$TYPEFILE"
		sed -i '' 's/AppBinding/any/g' "$TYPEFILE"
		sed -i '' 's/{ UserProfile }/{}/g' "$TYPEFILE"
		sed -i '' 's/UserProfile/any/g' "$TYPEFILE"
		sed -i '' 's/any["id"]/any/g' "$TYPEFILE"
		sed -i '' 's/channel_type: ChannelType/channel_type: string/g' "$TYPEFILE"
		sed -i '' 's/team_type: TeamType/team_type: string/g' "$TYPEFILE"
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

	echo "✔ Generics fixed!"

	npx ts-to-zod "$TYPEFILE" "$OUTFILE"

	if [[ "$FILENAME" = "posts" || "$FILENAME" = "posts.responses" ]]; then
		sed -i '' 's/postSchema.partial()/postSchema/g' "$OUTFILE"
		sed -i '' 's/import type { TeamType } from "./teams";//g' "$OUTFILE"
		sed -i '' 's/import type { ChannelType } from "./channels"//g' "$OUTFILE"
	fi
done

rm -rf $(find $OUTDIR -maxdepth 1 -type f -path '*.typefile.ts')

echo "✅ Done!"
