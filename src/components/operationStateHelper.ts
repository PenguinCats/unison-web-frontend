export function GetOperationStatusTypeString(status: number) :string {
  switch (status) {
    case 0: return 'info';
    case 1: return 'info';
    case 3: return 'success';
    default: return 'error';
  }
}
export function GetOperationStatusDescription(status: number) : string {
  switch (status) {
    case 0: return '指令待发出';
    case 1: return '指令已发出，执行中';
    case 2: return '指令发送失败';
    case 3: return '指令执行成功';
    case 4: return '指令执行出错';
    default: return '未知错误';
  }
}
