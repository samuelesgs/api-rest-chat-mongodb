import * as bcrypt from "bcryptjs";

const saltOrRounds = 10;

async function generateHash(text : string) : Promise<string> {
    return await bcrypt.hash(text, saltOrRounds);
}

async function comparePlainToHash(text : string, hash : string) {
    return await bcrypt.compare(text, hash);
}

export { generateHash, comparePlainToHash }