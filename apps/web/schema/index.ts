import z from "zod";

export const createMenuFormSchema = z.object({
  title: z.string("Title should be a valid string"),
  subTitle: z.string("SubTitle should be a valid string"),
  description: z.string("Description should be a valid string"),
  price: z.number(),
  category: z.string(),
  tags: z.array(z.object({ label: z.string(), value: z.string() })),
  optionGroups: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().nonempty("Option group name cannot be empty"),
      required: z.boolean(),
      options: z.array(
        z.object({
          id: z.string().optional(),
          name: z.string().nonempty("Option name cannot be empty"),
          price: z.number(),
        }),
      ),
    }),
  ),
  imageUrl: z.string(),
});

export const editMenuFormSchema = z.object({
  title: z.string("Title should be a valid string"),
  subTitle: z.string("SubTitle should be a valid string"),
  description: z.string("Description should be a valid string"),
  price: z.number(),
  category: z.string().optional(),
  tags: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
  optionGroups: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().nonempty("Option group name cannot be empty"),
      required: z.boolean(),
      toDelete: z.boolean().optional(),
      options: z.array(
        z.object({
          id: z.string().optional(),
          name: z.string().nonempty("Option name cannot be empty"),
          price: z.number(),
          toDelete: z.boolean().optional(),
        }),
      ),
    }),
  ),
  imageUrl: z.string(),
});

export const editOrderFormSchema = z.object({
  orderNumber: z.string("Title should be a valid string").readonly(),
  status: z.string("SubTitle should be a valid string"),
  total: z.number(),
});
