import React, { createContext, useContext, useState, useCallback, ReactNode, ReactElement, cloneElement } from 'react';

interface DrawerContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export function Drawer({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <DrawerContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (!context) {
    return {
      isOpen: false,
      open: () => {},
      close: () => {},
      toggle: () => {},
    };
  }
  return context;
}

export function Target({
  children,
  openClass = 'drawer-opened',
  closedClass = 'drawer-closed',
}: {
  children: ReactElement<any>;
  openClass?: string;
  closedClass?: string;
}) {
  const { isOpen } = useDrawer();
  const currentClass = isOpen ? openClass : closedClass;

  if (React.isValidElement(children)) {
    const existingClass = (children.props as any).className || '';
    return cloneElement(children as any, {
      className: `${existingClass} ${currentClass}`.trim(),
    });
  }

  return <div className={currentClass}>{children}</div>;
}

export function useA11yCloseButton(ref?: any) {
  const { close } = useDrawer();
  return {
    onClick: close,
    'aria-label': 'Close menu',
  };
}

export function useA11yOpenButton(ref?: any) {
  const { open } = useDrawer();
  return {
    onClick: open,
    'aria-label': 'Open menu',
  };
}

const OriginalDrawer = {
  Drawer,
  Target,
  useDrawer,
  useA11yCloseButton,
  useA11yOpenButton,
};

export default OriginalDrawer;
