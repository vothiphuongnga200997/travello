export interface DialogInterface {
    title: string;
    content: string;
    data?: any;
    leftBtnLabel?: string;
    rightBtnLabel?: string;
    leftBtnStatus?: ButtonStatusEnum;
    rightBtnStatus?: ButtonStatusEnum;
}

export enum ButtonStatusEnum {
    Info = 'btn btn-info',
    Danger = 'btn btnbtn-danger',
    Hint = 'btn btn-hint',
}
