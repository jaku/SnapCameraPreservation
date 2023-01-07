# SnapCameraPreservation

The purpose of this project is to allow users to still use and find snap chat lesnes with the snap camera application after the Jan 25th, 2023 shutdown.

This project uses a modified version of the 1.21.0 version of Snap Chat for Windows. Be sure to install that one before replacing with the Snap Camera.exe file here.

# Instructions

Head over to https://snapchatreverse.jaku.tv/snap/ and make sure you have 1.21.0 installed. Provide my site the 1.21.0 exe located at the default install location of "C:\Program Files\Snap Inc\Snap Camera". Patch the file on the site, and make sure you replace the patched one with the original one.

I cannot host the EXE due to possible copyrights but I can patch it if you provide the original exe.

You'll know you are communicating with my server because a new category will be listed in the app called "Jaku Snap Backup".

If you see the above, go ahead and click on each of your saved lenses and activat them once to ensure they are backed up. After that you are free to sit back and relax.

# How does this work?

I've modified the Snap Camera.exe to use my servers instead of the Snap Chat servers. This was done with a hex editor and 2 modifications were made. Instead of communicating with studio-app.snapchat.com it now communicates with snapchatreverse.jaku.tv. By doing so my server then communicates to the Snap servers to get the lenses data as if you were accessing it directly and downloads the lenses to an S3 bucket on Amazon. 

# Where is the code?
As of Jan 6th, 2023 I've been very sick. I am working to clean it up and host the server code here so that others can host it themselves if they wish. Hopefully early next week I'll have this ready. The EXE is very easy to compare the normal download to with mine to see the changes with soemthing like WinDiff if you wish to see the changes directly.

# I have more questions or comments.
Feel free to submit an issue on Github with questions or message me on Twitter at https://twitter.com/jaku. 
