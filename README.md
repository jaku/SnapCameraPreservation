## January 15th, 2024 Update

It's been a little over a year now since this project got started; when I first set off to develop this, I only thought a few hundred people would be interested; as of my last count, we had over 1 million unique users end up patching and using this project/server in some way. When I first built this, we were in a bit of a rush as the servers were shutting down, and unfortunately for me, I was sick with the flu at the time. So the solution put in place for Windows was good, but the MacOS implementation could have been better if I had more time to research. So the update to this project today brings a better solution to MacOS users, which should overall be easier for users and should be able to last for as long as MacOS can run the Snap Camera application.

I've recently been coding an update to this entire project that will make setup for all users to configure and setup, as well as bring new and old features back to the application. I have been live-streaming some of the developments on my [Twitch channel](https://twitch.tv/jaku). I'll share more info here and update the images in the Snap Camera app as I make progress. I do plan to have some features that require payment in the new app, as I have spent much of my time and resources on this project in the last year, and overall, it has cost me more than I have received from those who have tipped. While tipping is not required, if you received support from me, made a living, or just want to help support a developer making cool stuff, please consider tipping at one of these links. http://ko-fi.com/jaku, http://paypal.me/jaku, http://venmo.com/thejaku, and http://cash.app/thejaku. If you are unable to tip, that is okay too! Just remember, you can always follow me on https://twitter.com/jaku or https://twitch.tv/jaku to show support as well. Thank you.

Many MacOS users who have had their Snap Camera working since last year with my patch will break in the next few days, so be sure to follow the newly posted MacOS instructions below to get started. These new steps should work with any version of the application on MacOS. If you do have issues, though, please create a ticket here, and I will try to help.


## Notice
   As of January 26th, 2023, the domain Snap Camera normally uses is now offline. We will not be able to recover any lenses that are missing, please do not create issues looking for lenses or message me about it. If I find a way to bring the missing lenses I will make an update, but as of now, we do not have the ability to do this. 


# Installer
   If you do not have 1.21.0 installed for Windows, you can search for the installer, be careful though some installers may have extra software packed in with them. You can check the installer is the original one from Snap Camera by uploading your installer to https://emn178.github.io/online-tools/md5_checksum.html. If you get an MD5 of anything other than ec0816368314db8a35ddf06784ffadfe I recommend finding a site with the installer.


# SnapCameraPreservation
The purpose of this project is to allow users to still use and find snap chat lenses with the snap camera application after the Jan 25th, 2023 shutdown.

This project uses a modified version of the 1.21.0 version of Snap Chat for Windows. Be sure to install that one before following the instructions on this page.

# Instructions for PC
Head over to https://snapchatreverse.jaku.tv/snap/ and make sure you have 1.19.0 or 1.21.0 installed. Provide the site with your 1.19.0 or 1.21.0 version of "Snap Camera.exe" located at the default install location of "C:\Program Files\Snap Inc\Snap Camera". Do not patch the installer. 

Make sure the correct patch file for your version is selected on the site before applying the patch. 

After applying the patch, you NEED to replace the original "Snap Camera.exe" file with the newly created patched file, you will need to remove/rename the original file and then rename the patched file to "Snap Camera.exe" when neither one is running. Check Task Manager to kill the original Snap Camera process to ensure this goes smoothly.

Open a folder to "C:\Program Files\Snap Inc\Snap Camera", find the same "Snap Camera" or "Snap Camera.exe" file you used on the website, rename it to "Snap Camera - org", and now take the downloaded patched file and put it in this folder. Rename the patched file to just be "Snap Camera" or "Snap Camera.exe" if your original file had the .exe do not add the .exe if you didn't already have it.

Now you can run the file from there, and everything should be working as expected.


If you have issues, make sure you don't have any Adblock or things blocking the patch site and that you are patching the correct version. Additionally, make sure that the original Snap Camera application is stopped and not running at all. I recommend checking your task manager, searching for "Snap Camera" and closing it there to be sure. If it is running, you will not be able to replace its file with mine.

I cannot host the EXE due to copyright, but I can patch it if you provide the original exe.

You'll know you are communicating with my server because a new category will be listed in the app called "Jaku Snap Backup".

If you see the above, go ahead and click on each of your saved lenses and activate them once to ensure they are backed up. After that, you are free to sit back and relax.

# Instructions for Mac 2025+

A MacOS update in late 2025 has changed the way you must install and run the script. Please follow these instructions which should work on all MacOS versions that the previous script worked on, but I'll be leaving those instructions below just in-case.

Download this pkg file first. https://archive.org/download/snap-cam-mac/SnapCamMac.pkg

Make sure it's in your Downloads folder and has the name SnapCamMac.pkg

Then after that is downloaded follow the next steps.

Simply open up Terminal on your Mac; if you are not sure how to do this, you can follow these steps from Apple. https://support.apple.com/guide/terminal/open-or-quit-terminal-apd5265185d-f365-44cb-8b09-71a064a42125

Once you have Terminal open, copy and paste the following command in, exactly as it is typed here.

One thing to note: after pasting the line in and hitting enter, it will ask for your password. You will not see any indication that you are typing it in. You will get a password error if it is incorrect; just try again.

``sudo /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/jaku/SnapCameraPreservation/refs/heads/main/tahoe-mac.os)"``

After about a minute, it should complete, and you can now open the application. You should be good to go from this point.

# Instructions for Mac 2024

We changed how we handle the MacOS setup for Snap Camera, using terminal to download and run a single script file, this will handle the setup for everything. You will no longer need to worry about the certificate from expiring as we are patching the application similar to how we do on Windows.

Simply open up Terminal on your Mac; if you are not sure how to do this, you can follow these steps from Apple. https://support.apple.com/guide/terminal/open-or-quit-terminal-apd5265185d-f365-44cb-8b09-71a064a42125

Once you have Terminal open, copy and paste the following command in, exactly as it is typed here.

One thing to note: after pasting the line in and hitting enter, it will ask for your password. You will not see any indication that you are typing it in. You will get a password error if it is incorrect; just try again.

``sudo /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/jaku/SnapCameraPreservation/main/mac.sh)"``

After about a minute, it should complete, and you can now open the application. You should be good to go from this point.


# Unlock Lenses?
**The below will no longer work now that they shut down the servers.**

Since starting this project, I learned that some lenses are not available in the search of Snap Camera and instead must be directly searched for by their URL in the search box. I'm happy to report that these also work on this project, and as an extra bonus I made it so that you can use links like ``https://lens.snapchat.com/81f476238cf84615ba349efe82b36c27`` instead of the ``https://www.snapchat.com/unlock/?type=SNAPCODE&uuid=81f476238cf84615ba349efe82b36c27&metadata=01`` style links. 

**The above will no longer work now that they shut down the servers.**

# How does this work?
I've modified the Snap Camera.exe (for Windows) to use my servers instead of the Snap Chat servers. This was done with a hex editor, and 2 modifications were made. Instead of communicating with studio-app.snapchat.com it now communicates with snapchatreverse.jaku.tv.For Mac users, we aren't changing the host but instead telling it that the host's IP is something else and installing a self-signed certificate. By doing so my server then communicates to the Snap servers to get the lens data as if you were accessing it directly and downloads the lenses to an S3 bucket on Amazon. 

I then wrote a server that relays the information from the camera app to the Snap Camera servers (for now), which downloads the lenses separately and communicates back to the app in the way it expects.  


# Where is the code?
The server code can be found in the server folder. You can see how the server worked by relaying the information from the Snap Chat servers when the servers were online. I also created a reference folder that contains all the known endpoints and their expected responses.

# Who are you, and why are you doing this?
I am Jaku. If you're familiar with the software on Twitch called Crowd Control, then you're already familiar with some of my work as I run the company behind that. Or maybe you were an Animal Crossing fan and played in 2020 and used https://turnip.exchange, I, along with another friend (Ross), built that. You can find more about me at https://about.me/jaku, but overall I just like to build things and have been building things for Twitch streamers, gamers, and others for over seven years now. I have a background that allows for this stuff, and I enjoy working on them. 


# I have more questions or comments.
Feel free to submit an issue on Github with questions or message me on Twitter at https://twitter.com/jaku, but please be sure to read this page first as I cannot help with recovering missing lenses. 
