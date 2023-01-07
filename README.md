# SnapCameraPreservation

The purpose of this project is to allow users to still use and find snap chat lenses with the snap camera application after the Jan 25th, 2023 shutdown.

This project uses a modified version of the 1.21.0 version of Snap Chat for Windows. Be sure to install that one before following the instructions on this page.

# Instructions

Head over to https://snapchatreverse.jaku.tv/snap/ and make sure you have 1.21.0 installed. Provide the site the 1.21.0 version of "Snap Camera.exe" located at the default install location of "C:\Program Files\Snap Inc\Snap Camera". Patch the file on the site, and make sure you replace the original file with the newly created patch file, you will need to rename the patch file to make it match.

I cannot host the EXE due to possible copyrights but I can patch it if you provide the original exe.

You'll know you are communicating with my server because a new category will be listed in the app called "Jaku Snap Backup".

If you see the above, go ahead and click on each of your saved lenses and activat them once to ensure they are backed up. After that you are free to sit back and relax.

# How does this work?

I've modified the Snap Camera.exe to use my servers instead of the Snap Chat servers. This was done with a hex editor and 2 modifications were made. Instead of communicating with studio-app.snapchat.com it now communicates with snapchatreverse.jaku.tv. By doing so my server then communicates to the Snap servers to get the lenses data as if you were accessing it directly and downloads the lenses to an S3 bucket on Amazon. 

I then wrote a server that relays the information from the camera app to the snap chat servers (for now), which downloads the lenses separately and communicates back to the app in the way it expects.  

# Where is the code?
As of Jan 3rd, 2023 I've been very sick. So I've not been able to work on this as much and have made a lot of bad code. I plan to clean it up and host the server code here so that others can host it themselves if they wish and hopefully early next week (Jan 8-12th) I'll have this ready. The EXE is very easy to compare the normal download to with mine to see the changes with soemthing like WinDiff if you wish to see the changes directly.

# Who are you and why are you doing this?

I am Jaku. If you're familar with the software on Twitch called Crowd Control then you're already familar with some of my work as I run the company behind that. Or maybe you were an Animal Crossing fan and played in 2020 and used https://turnip.exchange, I along with another friend (Ross) built that. You can find more about me at https://about.me/jaku but overall I just like to build things and have been building things for Twitch streamers, gamers and others for over 7 years now. I have a background that allows for this sort of stuff, and I enjoy working on them. 


# I have more questions or comments.
Feel free to submit an issue on Github with questions or message me on Twitter at https://twitter.com/jaku. 
