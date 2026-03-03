"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "./ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Image from "next/image";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import CustomComboBox from "./CustomComboBox";
import { editMenuFormSchema } from "@/schema";
import { uploadImage } from "@/services";
import { NumericFormat } from "react-number-format";
import { Edit2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "./ui/switch";

type Props = {
  control: any;
  form: any;
  groupIndex: number;
  removeGroup: (index: number) => void;
};

function OptionGroupField({ form, control, groupIndex, removeGroup }: Props) {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `optionGroups.${groupIndex}.options`,
  });

  const watchedOptionGroups = form.watch("optionGroups");

  const watchedOptions = form.watch(`optionGroups.${groupIndex}.options`);

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {optionFields.map((option, optionIndex) => (
          <div key={option.id} className="flex gap-2">
            <Input
              placeholder="Option name"
              {...form.register(
                `optionGroups.${groupIndex}.options.${optionIndex}.name`,
              )}
            />
            <FormField
              control={form.control}
              name={`optionGroups.${groupIndex}.options.${optionIndex}.price`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <NumericFormat
                      thousandSeparator
                      allowNegative={false}
                      value={field.value}
                      onValueChange={(values) => {
                        field.onChange(values.floatValue);
                      }}
                      className="border p-3 py-2 w-full rounded-md"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {watchedOptions[optionIndex].id && (
              <Button
                type="button"
                className="self-end"
                onClick={() => {
                  form.setValue(
                    `optionGroups.${groupIndex}.options.${optionIndex}.toDelete`,
                    !watchedOptions[optionIndex].toDelete,
                  );
                }}
              >
                {watchedOptions[optionIndex].toDelete
                  ? "Marked Option for deletion"
                  : "Delete Option"}
              </Button>
            )}

            {!watchedOptions[optionIndex].id ? (
              <Button
                type="button"
                className="self-end"
                onClick={() => removeOption(optionIndex)}
              >
                Remove Option
              </Button>
            ) : null}

            {/* <Button onClick={() => removeOption(optionIndex)}>
              Remove Option
            </Button> */}
          </div>
        ))}
        <Button onClick={() => appendOption({ name: "", price: 0 })}>
          Add Option
        </Button>
      </div>
      {watchedOptionGroups[groupIndex].id && (
        <Button
          type="button"
          className="self-end"
          onClick={() =>
            form.setValue(
              `optionGroups.${groupIndex}.toDelete`,
              !watchedOptionGroups[groupIndex].toDelete,
            )
          }
        >
          {watchedOptionGroups[groupIndex].toDelete
            ? "Marked Group for deletion"
            : "Delete Group"}
        </Button>
      )}

      {!watchedOptionGroups[groupIndex].id ? (
        <Button
          type="button"
          className="self-end"
          onClick={() => removeGroup(groupIndex)}
        >
          Remove Group
        </Button>
      ) : null}
    </div>
  );
}

const EditItem = ({ menu }: { menu: any }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const { category, tags, ...others } = menu;

  const form = useForm<z.infer<typeof editMenuFormSchema>>({
    resolver: zodResolver(editMenuFormSchema),
    defaultValues: {
      ...others,
      tags: tags.map((tag: any) => ({ label: tag, value: tag })),
      price: menu.price / 100,
      optionGroups:
        menu.optionGroups.length > 0
          ? menu.optionGroups.map((optionGroup: any) => ({
              id: optionGroup.id,
              required: optionGroup.required,
              name: optionGroup.name,
              options: optionGroup.options?.map((option: any) => ({
                id: option.id,
                name: option.name,
                price: option.price / 100,
                toDelete: false,
              })),
              toDelete: false,
            }))
          : {
              name: "",
              required: false,
              toDelete: false,
              options: [{ name: "", price: 0, toDelete: false }],
            },
    },
  });

  const {
    fields: groupFields,
    append: appendGroup,
    remove: removeGroup,
  } = useFieldArray({
    control: form.control,
    name: "optionGroups",
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.patch(`/api/menu/${menu.id}`, data);

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
      toast.success("Menu has been edited successfully");
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message);
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get("/api/category");

      return res.data;
    },
  });

  async function onSubmit(values: any) {
    const { category, ...others } = values;
    mutation.mutate({
      ...others,
      categoryId: category,
      tags: values.tags.map((tag: any) => tag.value),
      price: values.price * 100,
    });
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement | null>,
  ) => {
    const file = e.target.files?.[0];
    setIsUploading(true);

    try {
      const { secure_url } = await uploadImage(file);

      form.setValue("imageUrl", secure_url);
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* <Button className="cursor-pointer"> */}
        <Edit2 />
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] min-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Menu Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Efo Riro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <NumericFormat
                        thousandSeparator
                        allowNegative={false}
                        value={field.value}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue);
                        }}
                        className="border p-3 py-2 w-full rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={() => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        disabled={isUploading}
                        onChange={handleImageUpload}
                      />
                    </FormControl>
                    <FormMessage />
                    {isUploading && <div>Uploading image...</div>}
                    {form.getValues("imageUrl") && (
                      <Image
                        alt="menu-image"
                        src={form.getValues("imageUrl")}
                        height={200}
                        width={200}
                      />
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input placeholder="Made from vegie..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="This efo riro soup is..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                {groupFields.map((group, groupIndex) => {
                  return (
                    <div key={group.id ?? groupIndex} className="space-y-3">
                      <div className="flex gap-4">
                        <FormField
                          control={form.control}
                          name={`optionGroups.${groupIndex}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Option/SideDish Group Name</FormLabel>
                              <FormControl>
                                <Input placeholder="" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`optionGroups.${groupIndex}.required`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Option/SideDish Group Required
                              </FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <OptionGroupField
                        form={form}
                        control={form.control}
                        groupIndex={groupIndex}
                        removeGroup={removeGroup}
                      />
                    </div>
                  );
                })}
                <Button
                  onClick={() =>
                    appendGroup({
                      name: "",
                      required: false,
                      toDelete: false,
                      options: [{ name: "", price: 0, toDelete: false }],
                    })
                  }
                >
                  Add Group
                </Button>
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={menu.category.id}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {categories?.map((category: any) => {
                              return (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <CustomComboBox
                          name="tags"
                          form={form}
                          onChange={field.onChange}
                          defaultOptions={tags.map((tag: any) => ({
                            label: tag,
                            value: tag,
                          }))}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full cursor-pointer"
              >
                {mutation.isPending ? <Spinner /> : "Edit Menu"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditItem;
