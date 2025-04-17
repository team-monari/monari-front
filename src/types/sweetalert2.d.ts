declare module "sweetalert2" {
  /**
   * SweetAlert2의 기본 옵션 인터페이스
   */
  interface SweetAlertOptions {
    title?: string;
    text?: string;
    icon?: "success" | "error" | "warning" | "info" | "question";
    showConfirmButton?: boolean;
    confirmButtonText?: string;
    confirmButtonColor?: string;
    showCancelButton?: boolean;
    cancelButtonText?: string;
    timer?: number;
    timerProgressBar?: boolean;
    position?:
      | "top"
      | "top-start"
      | "top-end"
      | "center"
      | "center-start"
      | "center-end"
      | "bottom"
      | "bottom-start"
      | "bottom-end";
    toast?: boolean;
    [key: string]: any;
  }

  /**
   * SweetAlert2의 결과 인터페이스
   */
  interface SweetAlertResult {
    isConfirmed: boolean;
    isDenied: boolean;
    isDismissed: boolean;
    value?: any;
    [key: string]: any;
  }

  /**
   * SweetAlert2 기본 함수
   */
  interface SweetAlert {
    (options: SweetAlertOptions): Promise<SweetAlertResult>;
    fire(options: SweetAlertOptions): Promise<SweetAlertResult>;
    fire(
      title?: string,
      text?: string,
      icon?: string
    ): Promise<SweetAlertResult>;
    close(): void;
    closeModal(): void;
    closeToast(): void;
    enableButtons(): void;
    disableButtons(): void;
    showLoading(): void;
    hideLoading(): void;
    isLoading(): boolean;
    getTimerLeft(): number | undefined;
    stopTimer(): number | undefined;
    resumeTimer(): number | undefined;
    toggleTimer(): number | undefined;
    isTimerRunning(): boolean;
    increaseTimer(n: number): number | undefined;
    [key: string]: any;
  }

  const swal: SweetAlert;
  export default swal;
}
