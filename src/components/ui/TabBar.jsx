import { Paper, Tabs, Tab } from "@mui/material";
import { LayoutDashboard, List, Target, PlusCircle, Pencil } from "lucide-react";

const TABS = [
  { id: "dashboard",    label: "Painel",      Icon: LayoutDashboard },
  { id: "transactions", label: "Lancamentos", Icon: List },
  { id: "goals",        label: "Metas",       Icon: Target },
];

export const TabBar = ({ activeTab, onSelect, hasEdit }) => {
  const allTabs = [
    ...TABS,
    { id: "add", label: hasEdit ? "Editar" : "Adicionar", Icon: hasEdit ? Pencil : PlusCircle },
  ];

  const value = allTabs.findIndex(t => t.id === activeTab);

  return (
    <Paper elevation={0} sx={{ borderRadius: 4, mb: 2, px: 1, background: "white" }}>
      <Tabs
        value={value === -1 ? 0 : value}
        onChange={(_, i) => onSelect(allTabs[i].id)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {allTabs.map(({ id, label, Icon }) => (
          <Tab
            key={id}
            label={label}
            icon={<Icon size={15} />}
            iconPosition="start"
            sx={{ gap: 0.5, minHeight: 48 }}
          />
        ))}
      </Tabs>
    </Paper>
  );
};
