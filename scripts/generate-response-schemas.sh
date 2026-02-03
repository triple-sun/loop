#!/bin/bash

# Ensure we are in the project root
cd "$(dirname "$0")/.."

echo "🚀 Starting Real API Schema Generation..."

for FILE in \
	src/types/posts.ts \
	src/types/bots.ts \
	src/types/channels.ts \
	src/types/common.ts \
	src/types/emojis.ts \
	src/types/files.ts \
	src/types/plugins.ts \
	src/types/reactions.ts src/types/roles.ts src/types/teams.ts src/types/users.ts; do

	if [ ! -f "$FILE" ]; then
		echo "FILE $FILE NOT FOUND!"
		exit 1
	fi

	FILENAME=$(basename $FILE .ts)
	OUTFILE="test/integration/real-api/schemas/$FILENAME.zod.ts"
	TYPEFILE="test/integration/real-api/schemas/$FILENAME.ts"

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
	if [ "$FILENAME" = "posts" ]; then
		echo "Fixing posts generics"
		sed -i '' 's/<PROPS_TYPE = Record<string, unknown>>//g' "$TYPEFILE"
		sed -i '' 's/PROPS_TYPE &/''/g' "$TYPEFILE"

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
		sed -i '' 's/{ FileInfo }/{}/g' "$TYPEFILE"
	fi

	# teams fix
	sed -i '' 's/{ ServerError }/{}/g' "$TYPEFILE"

	sed -i '' 's/{ StringBool }/{}/g' "$TYPEFILE"
	sed -i '' 's/StringBool/string/g' "$TYPEFILE"

	echo "✔ Generics fixed!"

	npx ts-to-zod "$TYPEFILE" "$OUTFILE"
done

echo "✅ Done!"
