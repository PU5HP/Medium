import z from "zod";
export declare const signupInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name?: string | undefined;
}, {
    email: string;
    password: string;
    name?: string | undefined;
}>;
export type SignupInput = z.infer<typeof signupInput>;
export declare const signinInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type SigninInput = z.infer<typeof signinInput>;
export declare const createPostInput: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    published: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    published: boolean;
}, {
    title: string;
    content: string;
    published: boolean;
}>;
export type CreatePostInput = z.infer<typeof createPostInput>;
export declare const updatePostInput: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    published: z.ZodBoolean;
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    published: boolean;
    id: string;
}, {
    title: string;
    content: string;
    published: boolean;
    id: string;
}>;
export type UpdatePostInput = z.infer<typeof updatePostInput>;
