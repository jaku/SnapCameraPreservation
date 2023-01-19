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



## Contact 

jaku - [@jaku](https://twitter.com/jaku) - https://discord.gg/jaku


