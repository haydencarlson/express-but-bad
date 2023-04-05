import { ExpressButBadRequest } from './handler';

module.exports = async (req: ExpressButBadRequest) => {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  const data = Buffer.concat(buffers).toString();

  try {
    const parsed = JSON.parse(data);
    return parsed;
  } catch(e) {
    return data.toString()
  }
};