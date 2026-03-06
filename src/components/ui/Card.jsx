export const Card = ({ children, style = {} }) => (
  <div style={{ background: "white", borderRadius: 16, padding: 16, ...style }}>
    {children}
  </div>
);
