"use client"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"

import {Button} from "@/shared/ui/button"

import {
    Field,
    FieldLabel,
} from "@/shared/ui/field"
import {Input} from "@/shared/ui/input"

import {FormGrid} from "@/shared/components/layout/FormGrid.tsx";

interface PageFilterProps {
    onSubmit: (values: z.infer<typeof formSchema>) => void;
}

const formSchema = z.object({
    username: z
        .string()
        .max(30, "username must be at most 30 characters."),
    name: z
        .string()
        .max(50, "Name must be at most 50 characters."),
})

export function UsersFilterForm({onSubmit}: PageFilterProps) {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            name: "",
        },
    })

    return (
        <>
            <form id="users-filter-form" onSubmit={handleSubmit(onSubmit)}>
                <FormGrid>
                    <Field>
                        <FieldLabel>Username</FieldLabel>
                        <Input
                            {...register("username")}
                        />
                        <p className="h-4 truncate text-[10px] text-destructive" title={errors.name?.message}>
                            {errors.username?.message}
                        </p>
                    </Field>
                    <Field>
                        <FieldLabel>Name</FieldLabel>
                        <Input
                            {...register("name")}
                        />
                        <p className="h-4 truncate text-[10px] text-destructive" title={errors.name?.message}>
                            {errors.name?.message}
                        </p>
                    </Field>
                    <div className="flex items-center justify-start">
                        <Button type="submit">
                            Search
                        </Button>
                    </div>
                </FormGrid>
            </form>

        </>
    )
}
