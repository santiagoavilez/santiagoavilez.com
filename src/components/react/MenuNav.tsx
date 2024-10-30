import { Sheet,  SheetContent, SheetTrigger } from '@components/ui/sheet'
import React from 'react'




interface MenuNavProps extends React.ComponentPropsWithoutRef<typeof Sheet> {
  trigger?: React.ReactNode;
  menu?: React.ReactNode;
}

export default function MenuNav({
  trigger,
  menu
}:MenuNavProps ) {
  return (

    <Sheet >
      <SheetTrigger className='md:hidden'>

          {trigger}

      </SheetTrigger>
      <SheetContent closeHidden side={'top'} className='p-0 mt-16' >
        {menu}
      </SheetContent>
    </Sheet>
  )
}
