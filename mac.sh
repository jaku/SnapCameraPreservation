#!/bin/bash

if [[ $EUID -ne 0 ]]; then
   echo "Please run this script as root (sudo)"
   exit 1
fi


# Check if Snap Camera is running
if pgrep -x "Snap Camera" > /dev/null; then
    pkill -x "Snap Camera"
fi

launchctl remove com.snap.SnapCameraRemover 2> /dev/null
rm -rf ~/Library/Caches/Snap/ 2> /dev/null
rm -rf ~/Library/Caches/com.snap.SnapCamera/ 2> /dev/null
rm -rf ~/Library/Preferences/Snap/ 2> /dev/null
rm -rf ~/Library/Preferences/com.snap.SnapCamera.plist 2> /dev/null
rm -rf ~/Library/Preferences/com.snap.Snap\ Camera.plist 2> /dev/null
rm -rf /Applications/Snap\ Camera.app/ 2> /dev/null

echo "Please wait while we download Snap Camera"
curl https://snapchatreverse.jaku.tv/snap/static/SnapCamMac.pkg -o /tmp/SnapCamMac.pkg 2> /dev/null

installer -allowUntrusted -verboseR -pkg /tmp/SnapCamMac.pkg -target / > /dev/null

echo "Waiting to make sure Snap Camera is installed"
if pgrep -x "Snap Camera" > /dev/null; then
    pkill -x "Snap Camera"
fi
sleep 1
if pgrep -x "Snap Camera" > /dev/null; then
    pkill -x "Snap Camera"
fi
sleep 2
if pgrep -x "Snap Camera" > /dev/null; then
    pkill -x "Snap Camera"
fi


original_binary="/Applications/Snap Camera.app/Contents/MacOS/Snap Camera"
tmp_hex_dump="/tmp/snapcamera.hex"
modified_binary="/tmp/snapcamera"

if [ ! -f "/Applications/Snap Camera.app/Contents/MacOS/Snap Camera" ]; then
    echo "Snap Camera not found. Please install first and then run this script."
    exit 1
fi

# Define the original and replacement URLs in hex without spaces
# https://studio-app.snapchat.com
original_url_hex="68747470733a2f2f73747564696f2d6170702e736e6170636861742e636f6d"
# https://snapchatreverse.jaku.tv/snap
replacement_url_hex="68747470733a2f2f736e617063686174726576657273652e6a616b752e7476"

echo "This part will take a while. Please be patient."

# Step 1: Dump the binary to a plain hex representation
xxd -p "$original_binary" | tr -d '\n' > "$tmp_hex_dump"

if [ $? -ne 0 ]; then
    echo "Failed to dump the Snap Camera app, check that Terminal has permission under App Management and try again."
    exit 1
fi

# Step 2: Modify the hex representation
sed -i '' "s/$original_url_hex/$replacement_url_hex/g" "$tmp_hex_dump"

# Step 3: Convert the hex representation back to a binary
xxd -r -p "$tmp_hex_dump" > "$modified_binary"

# Step 4: Overwrite the original binary with the modified version
# Note: This step requires administrative privileges
sudo cp "$modified_binary" "$original_binary"

if [ $? -ne 0 ]; then
    echo "Unable to complete the application move, check that Terminal has permission under App Management and try again."
    sleep 2
    open "https://support.apple.com/guide/mac-help/allow-apps-to-control-other-apps-on-mac-mchl07817563/mac"
    exit 1
fi


# Clean up temporary files
rm "$tmp_hex_dump"
rm "$modified_binary"


chmod +x "/Applications/Snap Camera.app/Contents/MacOS/Snap Camera"
codesign --remove-signature "/Applications/Snap Camera.app"

if [ $? -ne 0 ]; then
# Move the application to another spot before signing as it can fail for some users
    cp -fa "/Applications/Snap Camera.app" "/Applications/Snap Camera Temp.app"
    codesign --remove-signature "/Applications/Snap Camera Temp.app"
    
    if [ $? -ne 0 ]; then
        echo "Failed to remove signatures, Xcode command line tools may not be installed."
        exit 1
    fi

    xattr -cr "/Applications/Snap Camera Temp.app"
    codesign --force --deep --sign - "/Applications/Snap Camera Temp.app"
    #rm -rf "/Applications/Snap Camera.app"
    cp -fa "/Applications/Snap Camera Temp.app" "/Applications/Snap Camera.app"
    #rm -rf "/Applications/Snap Camera Temp.app"
    echo "Snap Camera has been patched!!"
    open "/Applications/Snap Camera.app"
    exit 0
fi

xattr -cr "/Applications/Snap Camera.app"
codesign --force --deep --sign - "/Applications/Snap Camera.app"

echo "Snap Camera has been patched!"
open "/Applications/Snap Camera.app"
