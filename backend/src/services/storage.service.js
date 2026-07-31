import ImageKit, { toFile } from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

const uploadImage = async ({ buffer, fileName, folder = "Snitch" }) => {
  const image = await client.files.upload({
    file: await toFile(buffer),
    fileName,
    folder,
  });

  return image;
};

export default uploadImage;
