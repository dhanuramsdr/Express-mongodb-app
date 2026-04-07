import mongoose from 'mongoose';

export const dbConnection = async (): Promise<void> => {
  try {
    const dburl = process.env.MONGODB_URI;

    if (!dburl) {
      throw new Error('db url not fount');
    }
    await mongoose
      .connect(dburl)
      .then(() => {
        console.log('db connected');
      })
      .catch((e) => {
        console.log('db not connected');
        console.log(e);
      });
  } catch (error) {
    console.error(error);
  }
};
