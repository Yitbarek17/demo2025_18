import mongoose from 'mongoose';

const connectDB = async () => {
  let conn = null;
  let triedAtlas = false;
  try {
    const atlasURI = "mongodb+srv://yabume123:gamegame@mycluster.ft2d7.mongodb.net/database?retryWrites=true&w=majority&appName=MyCluster";
    console.log(atlasURI)
    if (atlasURI) {
      triedAtlas = true;
      conn = await mongoose.connect(atlasURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
      return conn;
    }
  } catch (error) {
    console.error('MongoDB Atlas connection error:', error);
    console.log('Attempting to connect to local MongoDB...');
  }
  try {
    const localURI = process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/ethiopian-project-management';
    conn = await mongoose.connect(localURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Local MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (triedAtlas) {
      console.error('Local MongoDB connection error:', error);
    } else {
      console.error('MongoDB connection error:', error);
    }
    console.log('Server will continue without MongoDB connection');
    return null;
  }
};

export default connectDB;