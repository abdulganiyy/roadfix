import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";

import { Eye } from "lucide-react";

const Item = ({ menu }: { menu: any }) => {
  return (
    <Sheet>
      <SheetTrigger>
        <Eye />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{menu.title}</SheetTitle>
          <SheetDescription className="font-bold">
            {menu.subTitle}
          </SheetDescription>
          <SheetDescription>{menu.description}</SheetDescription>
          <SheetDescription>
            Price:{" "}
            {new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
            }).format(menu.price / 100)}
          </SheetDescription>
          <SheetDescription>
            Category:{` `} {menu.category.name}
          </SheetDescription>
          <Image
            alt="menu-image"
            src={menu.imageUrl}
            height={200}
            width={200}
          />
          {menu.optionGroups.length != 0 && (
            <div>
              Option Groups:{` `}
              {menu.optionGroups.map((optiongroup: any) => {
                return (
                  <div className="mb-1 space-x-1">
                    <span>{optiongroup.name}</span>
                    {optiongroup.options?.length != 0 && (
                      <div>
                        Options:{` `}
                        {optiongroup.options?.map((option: any) => {
                          return (
                            <div className="mb-1 space-x-1">
                              <span>{option.name}</span>
                              <span>
                                {new Intl.NumberFormat("en-NG", {
                                  style: "currency",
                                  currency: "NGN",
                                }).format(option.price / 100)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div>
            Tags:{` `} {menu.tags.join(",")}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Item;
