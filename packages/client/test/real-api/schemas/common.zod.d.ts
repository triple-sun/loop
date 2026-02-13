import { z } from "zod";
import { SelectDataSource } from "./common";
export declare const selectDataSourceSchema: z.ZodEnum<typeof SelectDataSource>;
export declare const optionSchema: z.ZodObject<{
    value: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    text: z.ZodOptional<z.ZodString>;
    icon_data: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const dataSourceSchema: z.ZodObject<{
    data_source: z.ZodOptional<z.ZodEnum<typeof SelectDataSource>>;
}, z.core.$strip>;
export declare const optionsSchema: z.ZodObject<{
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        value: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
        icon_data: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const minMaxLentghSchema: z.ZodObject<{
    min_length: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    max_length: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
//# sourceMappingURL=common.zod.d.ts.map