import { id } from "date-fns/locale";
import { registerLocale } from "react-datepicker";

registerLocale("id", id);

export const DATEPICKER_LOCALE = "id";
export const DATEPICKER_FORMAT = "dd/MM/yyyy HH:mm";
