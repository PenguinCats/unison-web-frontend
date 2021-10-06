export function GetAuthTypeString(auth: number) :string {
  switch (auth) {
    case 1: return 'error';
    case 2: return 'warning';
    default: return 'info';
  }
}
export function GetAuthTypeName(auth: number) : string {
  switch (auth) {
    case 1: return '超级管理员';
    case 2: return '管理员';
    default: return '普通用户';
  }
}
export function GetNameWithSEUID(name: string, seuID:string):string {
  if (seuID === '') {
    return name;
  }
  return `${seuID}, ${name}`;
}
