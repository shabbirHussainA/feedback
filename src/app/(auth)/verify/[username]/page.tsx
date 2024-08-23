'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { verifyValidation } from '@/schemas/verifySchema'
import ApiResponse from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

function VerifyAccount() {
    const router = useRouter()
    const params = useParams<{username: string}>()
    const {toast } = useToast()

    const form = useForm<z.infer<typeof verifyValidation>>({
        resolver: zodResolver(verifyValidation),
    })

    const onSubmit = async (data: z.infer<typeof verifyValidation>) => {
        try { //sending the values for verifying
            const response = await axios.post(`/api/verify-code`,{
                username: params.username,
                code:data.code,
            })
            
            if(response.data.success){

                toast({
                    title: "Success",
                    description: response.data.message
                })
                router.replace('sign-in')
            }
        } catch (error) {
            console.log("error in signup user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
              title: 'Sign up unsucessfull',
              description:axiosError.response?.data.message,
              variant:'destructive'
            })
            
        }
    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
                <FormItem>
                <FormLabel>code</FormLabel>
                <FormControl>
                    <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                    This is your public display name.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit">Submit</Button>
      </form>
    </Form>
        </div>
    </div>
</div>
  )
}

export default VerifyAccount
