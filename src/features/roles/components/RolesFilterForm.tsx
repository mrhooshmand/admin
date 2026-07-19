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
    title: z
        .string()
        .max(30, "title must be at most 30 characters."),
})

export function RolesFilterForm({onSubmit}: PageFilterProps) {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    })

    return (
        <>
            <form id="users-filter-form" onSubmit={handleSubmit(onSubmit)}>
                <FormGrid>
                    <Field>
                        <FieldLabel>Title</FieldLabel>
                        <Input
                            {...register("title")}
                        />
                        <p className="h-4 truncate text-[10px] text-destructive" title={errors.title?.message}>
                            {errors.title?.message}
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
