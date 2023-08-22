export abstract class HashAbstractClass {
  abstract hashing(data: any): Promise<string>;

  abstract verifyHash(hash: string, data: any): Promise<boolean>;
}
