## Information

This server is not completed, it is only going to backup and relay information for the Snap Camera application at this time. An updated version of this will cut off the relay from Snap Chats server after the Janauary 25th, shutdown. This application however is working and will help backup your existing lenses to your own S3 or S3 compatible storage.


### Prerequisites

This server requires nodeJS (16+) and mysql/mariaDB, nginx and an S3 storage solution. I will not go over how to install or setup these systems. 


### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/jaku/SnapCameraPreservation
   ```
2. Navigate to the server folder of the repo
   ```sh
   cd SnapCameraPreservation/server/
   ```
3. Setup the sql database with the schema file provided. Create the database and restore schema with your details.
   ```sh
   mysql -uYOUR_USERNAME -p YOUR_DB_NAME < db_schema.sql
   ```
4. Setup your `.env` file with your database and S3 credentials
   ```sh
   cp example.env .env && nano .env
   ```
5. Run the server!
   ```sh
   node server.js
   ```

This will get the server up and running, but you'll need to still patch the .exe and setup nginx with your own certificates and settings. I've included a snap.nginx.conf file as an example. Remeber the domain you are replacing in the application must be a full 23 characters long, anything more or less can cause the patch to not work. 

## Additional Information

To prevent others from asking many of the same questions or getting lost I'll try and describe things in a bit more detail here on some of the setup process and steps.

Starting with nginx, we have the example snap.nginx.conf file. We use nginx to proxy all the http/https requests to our node application on the speficied port in both the .env file and nginx config. If you update the .env PORT to be something different you will also need to match it in your nginx config ``proxy_pass http://127.0.0.1:5645;``.

In the nginx config and in the section above I mentioned you should make sure your domain is 23 characters long. The reason for this at least on the PC patching part is that we are just replacing the domain that snapchat uses with our own. When replacing a hostname or anything like that in a binary that has been compiled having extra or less characters can cause issues. I don't know if having a domain with 22 characters will work or not, but I know 23 will and so my instructions state that. Feel free to do do your own testing but I won't be able to help you if you're not using 23 characters. In my case the domain we are using is ``snapchatreverse.jaku.tv``, I am using a subdomain and so you can do that same to match the character amount you need if your domain itself isn't long enough.

The above instructions all will only work for PC users, the MacOS configuration is different and I'll explain the concept. You'll still need an nginx file, but not the same one as the PC. On PC we're actually patching the host that we're communicating to, on MacOS we're tricking it into believing my server is the original snap camera server. We do this by adding a ``/etc/hosts`` entry for ``studio-app.snapchat.com``. So our nginx file will need to reflect that as well, instead of our own custom domain. Additionally we need to generate a self-signed certifcate for the domain ``studio-app.snapchat.com`` and then install the certificate and trust it on MacOS. You can google to figure out how to do all that, I don't have the instructions I followed saved anywhere.

This gets communication working between your copy of Snap Camera and my servers. The application itself uses REST for all of it's communication.

On to the actual setup of the ``server.js``, the first thing to note is the example.env file, this needs to be copied to .env and the contents updated to match your settings.

```
AWS_ACCESS_KEY="" #this should be your AWS access key that you get on AWS
AWS_SECRET_ACCESS_KEY="" #same as above but it will be your AWS secret
S3BUCKET="" #S3 bucket name on AWS
S3URL="" #S3 URL for your bucket, typically would be something like "s3.amazonaws.com/YOUR_S3BUCKET"
DB_HOST="localhost" #where your mysql database is currently running, typically localhost
DB_NAME="" #name of the mysql database, I recommend snapchat
DB_USER="" #username of the mysql user, can be whatever you want/created
DB_PASS="" #same as above but is the password for the user
PORT=5646 #this is the port for the server.js to use and the nginx config file to use to know how to communicate
```

That should get you more or less there. If you have any questions or comments let me know and I'll update this with more information.

## Contact 

jaku - [@jaku](https://twitter.com/jaku) - https://discord.gg/jaku


