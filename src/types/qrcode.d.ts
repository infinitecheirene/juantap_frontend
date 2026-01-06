declare module 'qrcode' {
  export function toDataURL(text: string, options?: any): Promise<string>;
  export function toString(text: string, options?: any, cb?: (err: any, data?: string) => void): void;
  export default { toDataURL } as any;
}
