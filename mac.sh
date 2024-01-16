#!/bin/bash

if [[ $EUID -ne 0 ]]; then
   echo "Please run this script as root (sudo)"
   exit 1
fi

# Check if Snap Camera is running
if pgrep -x "Snap Camera" > /dev/null; then
    pkill -x "Snap Camera"
fi

# Check if Snap Camera is installed
if [ ! -d "/Applications/Snap Camera.app" ]; then
    echo "Snap Camera not found. Please install first and then run this script."
    exit 1
fi

original_binary="/Applications/Snap Camera.app/Contents/MacOS/Snap Camera"
tmp_hex_dump="/tmp/snapcamera.hex"
modified_binary="/tmp/snapcamera"

if [ ! -f original_binary ]; then
    echo "Snap Camera not found. Please install first and then run this script."
    exit 1
fi

# Define the original and replacement URLs in hex without spaces
# https://studio-app.snapchat.com
original_url_hex="68747470733a2f2f73747564696f2d6170702e736e6170636861742e636f6d"
# https://snapchatreverse.jaku.tv/snap
replacement_url_hex="68747470733a2f2f736e617063686174726576657273652e6a616b752e7476"

echo "This part will take a whie. Please be patient."

# Step 1: Dump the binary to a plain hex representation
xxd -p "$original_binary" | tr -d '\n' > "$tmp_hex_dump"

# Step 2: Modify the hex representation
sed -i '' "s/$original_url_hex/$replacement_url_hex/g" "$tmp_hex_dump"

# Step 3: Convert the hex representation back to a binary
xxd -r -p "$tmp_hex_dump" > "$modified_binary"

# Step 4: Overwrite the original binary with the modified version
# Note: This step requires administrative privileges
sudo cp "$modified_binary" "$original_binary"

# Clean up temporary files
rm "$tmp_hex_dump"
rm "$modified_binary"


chmod +x "/Applications/Snap Camera.app/Contents/MacOS/Snap Camera"
codesign --remove-signature "/Applications/Snap Camera.app"
xattr -cr "/Applications/Snap Camera.app"
codesign --force --deep --sign - "/Applications/Snap Camera.app"

echo "Snap Camera has been patched. Please start the application."
