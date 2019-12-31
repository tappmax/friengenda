export type ConfirmationDialogProps = {
    /**
     * Title of dialog
     */
    title: string;

    /**
     * Message to display
     */
    message: any;

    /**
     * Icon to display
     */
    icon?: 'warning' | 'none';

    /**
     * Key to identify dialog usage
     */
    key: string;

    /**
     * Optional payload
     */
    payload?: any;
}

export type ConfirmationDialogState = {
    /**
     * True if the dialog is open
     */
    open: boolean;

    /**
     * Result of the dialog
     */
    result: boolean;

    /**
     * Dialog properties
     */
    props: ConfirmationDialogProps;
}



export type SessionDialogProps = {

}

export type SessionDialogState = {
    open: boolean;
    props: SessionDialogProps;
}