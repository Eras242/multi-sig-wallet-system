import { animated } from "@react-spring/web";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <animated.div className="flex items-center justify-center flex-col px-8 py-8 gap-4 border-box">
      {children}
    </animated.div>
  );
};

export default Container;
