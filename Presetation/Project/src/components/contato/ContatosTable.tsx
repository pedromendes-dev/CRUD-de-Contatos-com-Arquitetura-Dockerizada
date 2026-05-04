import React, { useState, ChangeEvent, useEffect, useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Collapse,
  Typography,
  Chip,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  FilterList,
  FilterListOff,
  PersonSearch,
} from "@mui/icons-material";
import { Contato } from "../../utils/types/contatoTypes";
import { ContatoEventType } from "../../utils/types/contatoEventTypes";
import {
  ContatoFilterField,
  ContatosTableProps,
  FormState,
  FilterConfig,
  FilterStatus,
} from "../../utils/types/contatoTableTypes";
import { useContatoEvents } from "../../hooks/contato/useContatoTypes";
import { Alert, Button, Paper, Select, TextField } from "../ui";
import { Logo } from "../shared/LogoExeterna";

const contatosCountCacheKey = "contatos-count-cache";

const tableForm: FormState = {
  open: false,
  editing: null,
  nome: "",
  telefone: "",
  email: "",
  saving: false,
};

const tableFilerConfig: FilterConfig = {
  open: false,
  field: "todos",
  rawValue: "",
  debouncedValue: "",
};

const tableFilterStatus: FilterStatus = {
  processing: false,
  error: "",
  idSearchResult: null,
  idSearchLoading: false,
};

const TABLE_HEAD_CELLS = [
  "#",
  "Nome",
  "Telefone",
  "E-mail",
  "Criado em",
  "Atualizado em",
  "Ações",
];

export const ContatosTable: React.FC<ContatosTableProps> = ({
  contatos,
  setContatos,
}) => {
  const { dispatchContatoEvent } = useContatoEvents();
  const [formState, setFormState] = useState<FormState>(tableForm);
  const [filterConfig, setFilterConfig] =
    useState<FilterConfig>(tableFilerConfig);
  const [filterStatus, setFilterStatus] =
    useState<FilterStatus>(tableFilterStatus);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contatoToDelete, setContatoToDelete] = useState<Contato | null>(null);

  const handleOpenDeleteDialog = (contato: Contato) => {
    setContatoToDelete(contato);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setContatoToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!contatoToDelete) return;
    await handleDelete(contatoToDelete);
    handleCloseDeleteDialog();
  };

  const handleOpenCreate = () => {
    setFormState({
      open: true,
      editing: null,
      nome: "",
      telefone: "",
      email: "",
      saving: false,
    });
  };

  const handleOpenEdit = (contato: Contato) => {
    setFormState({
      open: true,
      editing: contato,
      nome: contato.nome,
      telefone: contato.telefone,
      email: contato.email ?? "",
      saving: false,
    });
  };

  const handleClose = () => setFormState((prev) => ({ ...prev, open: false }));

  const handleSave = async () => {
    const { nome, telefone, email, editing } = formState;
    if (!nome || !telefone) return;

    try {
      setFormState((prev) => ({ ...prev, saving: true }));

      if (editing) {
        await dispatchContatoEvent({
          type: ContatoEventType.ATUALIZAR,
          id: editing.id,
          payload: { nome, telefone, email },
        });
        setContatos((current) =>
          current.map((c) =>
            c.id === editing.id
              ? {
                  ...c,
                  nome,
                  telefone,
                  email,
                  dataAtualizacao: new Date().toISOString(),
                }
              : c,
          ),
        );
      } else {
        const created = (await dispatchContatoEvent({
          type: ContatoEventType.CRIAR,
          payload: { nome, telefone, email },
        })) as Contato;
        if (created) setContatos((current) => [...current, created]);
      }

      sessionStorage.removeItem(contatosCountCacheKey);
      setFormState((prev) => ({ ...prev, open: false }));
    } catch (error) {
      console.error("Erro ao salvar contato:", error);
    } finally {
      setFormState((prev) => ({ ...prev, saving: false }));
    }
  };

  const handleDelete = async (contato: Contato) => {
    try {
      await dispatchContatoEvent({
        type: ContatoEventType.REMOVER,
        id: contato.id,
      });
      setContatos((current) => current.filter((c) => c.id !== contato.id));
      sessionStorage.removeItem(contatosCountCacheKey);
    } catch (error) {
      console.error("Erro ao remover contato:", error);
    }
  };

  const handleClearFilter = () => {
    setFilterConfig((prev) => ({
      ...prev,
      field: "todos",
      rawValue: "",
      debouncedValue: "",
    }));
    setFilterStatus(tableFilterStatus);
  };

  useEffect(() => {
    if (!filterConfig.open) {
      setFilterStatus((prev) => ({
        ...prev,
        processing: false,
        error: "",
        idSearchResult: null,
      }));
      setFilterConfig((prev) => ({ ...prev, debouncedValue: "" }));
      return;
    }

    setFilterStatus((prev) => ({ ...prev, processing: true }));
    const timeoutId = window.setTimeout(() => {
      const value = filterConfig.rawValue.trim();
      setFilterConfig((prev) => ({ ...prev, debouncedValue: value }));

      if (!value) {
        setFilterStatus((prev) => ({
          ...prev,
          error: "",
          processing: false,
          idSearchResult: null,
        }));
        return;
      }

      if (
        filterConfig.field === "id" &&
        (!Number.isInteger(Number(value)) || Number(value) <= 0)
      ) {
        setFilterStatus((prev) => ({
          ...prev,
          error: "Informe um ID numérico válido.",
          processing: false,
        }));
        return;
      }

      setFilterStatus((prev) => ({ ...prev, error: "", processing: false }));
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [filterConfig.rawValue, filterConfig.field, filterConfig.open]);

  useEffect(() => {
    if (filterConfig.field !== "id" || !filterConfig.debouncedValue) {
      setFilterStatus((prev) => ({ ...prev, idSearchResult: null }));
      return;
    }

    const id = Number(filterConfig.debouncedValue);
    if (!Number.isInteger(id) || id <= 0) return;

    setFilterStatus((prev) => ({
      ...prev,
      idSearchLoading: true,
      idSearchResult: null,
    }));

    dispatchContatoEvent({ type: ContatoEventType.BUSCAR_POR_ID, id })
      .then((result) =>
        setFilterStatus((prev) => ({
          ...prev,
          idSearchResult: (result as Contato) ?? "not-found",
        })),
      )
      .catch(() =>
        setFilterStatus((prev) => ({ ...prev, idSearchResult: "not-found" })),
      )
      .finally(() =>
        setFilterStatus((prev) => ({ ...prev, idSearchLoading: false })),
      );
  }, [filterConfig.debouncedValue, filterConfig.field, dispatchContatoEvent]);

  const displayedContatos = useMemo(() => {
    if (!filterConfig.open) return contatos;

    const value = filterConfig.debouncedValue.trim();
    if (!value) return contatos;

    if (filterConfig.field === "id") {
      if (filterStatus.idSearchLoading || filterStatus.idSearchResult === null)
        return [];
      if (filterStatus.idSearchResult === "not-found") return [];
      return [filterStatus.idSearchResult];
    }

    const normalized = value.toLowerCase();
    return contatos.filter((c) => {
      if (filterConfig.field === "todos") {
        return [
          c.id,
          c.nome,
          c.telefone,
          c.email ?? "",
          c.dataCriacao,
          c.dataAtualizacao,
        ].some((f) => String(f).toLowerCase().includes(normalized));
      }
      return String(c[filterConfig.field] ?? "")
        .toLowerCase()
        .includes(normalized);
    });
  }, [
    contatos,
    filterConfig,
    filterStatus.idSearchResult,
    filterStatus.idSearchLoading,
  ]);

  const filterActive =
    filterConfig.open && filterConfig.debouncedValue.trim().length > 0;

  return (
    <Box
      sx={{
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        p: { xs: 2, sm: 6 },
      }}
    >
      {/* ── Cabeçalho da página ─────────────────────────── */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          mb: 3,
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
        }}
      >
        <div>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#111827", letterSpacing: 0.2 }}
          >
            Gestão de Contatos
          </Typography>
          <Typography variant="body2" sx={{ color: "#9ca3af", mt: 0.5, fontSize: 13 }}>
            {contatos.length}{" "}
            {contatos.length === 1 ? "contato cadastrado" : "contatos cadastrados"}
            {filterActive && displayedContatos.length !== contatos.length && (
              <> · {displayedContatos.length} encontrado{displayedContatos.length !== 1 ? "s" : ""} com o filtro</>
            )}
          </Typography>
        </div>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Tooltip
            title={filterConfig.open ? "Fechar filtro" : "Filtrar contatos"}
          >
            <Button
              variant="outlined"
              startIcon={filterConfig.open ? <FilterListOff /> : <FilterList />}
              onClick={() =>
                setFilterConfig((prev) => ({ ...prev, open: !prev.open }))
              }
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              {filterConfig.open ? "Fechar" : "Filtro"}
            </Button>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreate}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Novo Contato
          </Button>
        </Stack>
      </Stack>

      {/* ── Card principal ──────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          border: "1px solid #dbe2ea",
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        {/* ── Painel de filtro ─────────────────────────── */}
        <Collapse in={filterConfig.open}>
          <Box
            sx={{ p: "24px 24px 16px", backgroundColor: "#fafbfd" }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "#6a7282",
                letterSpacing: 0.8,
                textTransform: "uppercase",
                mb: 1.5,
                display: "block",
              }}
            >
              Filtrar registros
            </Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ alignItems: { md: "flex-start" } }}
            >
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="filter-field-label">Campo</InputLabel>
                <Select
                  labelId="filter-field-label"
                  value={filterConfig.field}
                  label="Campo"
                  onChange={(e) =>
                    setFilterConfig((prev) => ({
                      ...prev,
                      field: e.target.value as ContatoFilterField,
                    }))
                  }
                >
                  <MenuItem value="todos">Todos os campos</MenuItem>
                  <MenuItem value="id">ID</MenuItem>
                  <MenuItem value="nome">Nome</MenuItem>
                  <MenuItem value="telefone">Telefone</MenuItem>
                  <MenuItem value="email">E-mail</MenuItem>
                  <MenuItem value="dataCriacao">Criado em</MenuItem>
                  <MenuItem value="dataAtualizacao">Atualizado em</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                label={
                  filterConfig.field === "id" ? "Digite o ID" : "Buscar..."
                }
                value={filterConfig.rawValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFilterConfig((prev) => ({
                    ...prev,
                    rawValue: e.target.value,
                  }))
                }
                sx={{ flexGrow: 1 }}
              />

              <Button
                variant="text"
                onClick={handleClearFilter}
                disabled={filterStatus.processing}
                sx={{
                  textTransform: "none",
                  alignSelf: { md: "flex-start" },
                  mt: { xs: 0, md: "2px" },
                }}
              >
                Limpar
              </Button>
            </Stack>

            {filterActive && (
              <Box sx={{mt: 1.5}}>
                <Chip
                  size="small"
                  label={`Filtrando por "${filterConfig.field === "todos" ? "todos os campos" : filterConfig.field}": ${filterConfig.debouncedValue}`}
                  onDelete={handleClearFilter}
                  sx={{
                    fontSize: 12,
                    bgcolor: "rgba(21,93,252,0.08)",
                    color: "#155dfc",
                    ".MuiChip-deleteIcon": { color: "#155dfc" },
                  }}
                />
              </Box>
            )}
          </Box>
          <Divider />
        </Collapse>

        {/* ── Alertas ──────────────────────────────────── */}
        {filterStatus.error && (
          <Box sx={{ p: "16px 24px 0" }}>
            <Alert severity="warning">{filterStatus.error}</Alert>
          </Box>
        )}
        {filterConfig.field === "id" &&
          filterStatus.idSearchResult === "not-found" &&
          !filterStatus.idSearchLoading && (
            <Box sx={{ p: "16px 24px 0" }}>
              <Alert severity="info">
                Nenhum contato encontrado com o ID{" "}
                <strong>{filterConfig.debouncedValue}</strong>.
              </Alert>
            </Box>
          )}

        {/* ── Tabela ───────────────────────────────────── */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                {TABLE_HEAD_CELLS.map((label) => (
                  <TableCell
                    key={label}
                    align={label === "Ações" ? "right" : "left"}
                    sx={{
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      color: "#374151",
                      py: 1.5,
                      borderBottom: "1px solid #e5eaf0",
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {displayedContatos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={TABLE_HEAD_CELLS.length}
                    sx={{ py: 8, textAlign: "center", border: "none" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1.5,
                        color: "#9ca3af",
                      }}
                    >
                      <PersonSearch sx={{ fontSize: 48, opacity: 0.45 }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {filterActive
                          ? "Nenhum contato corresponde ao filtro aplicado."
                          : "Nenhum contato cadastrado ainda."}
                      </Typography>
                      {!filterActive && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Add />}
                          onClick={handleOpenCreate}
                          sx={{ textTransform: "none", mt: 0.5 }}
                        >
                          Cadastrar primeiro contato
                        </Button>
                      )}
                      {filterActive && (
                        <Button
                          variant="text"
                          size="small"
                          onClick={handleClearFilter}
                          sx={{ textTransform: "none" }}
                        >
                          Limpar filtro
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                displayedContatos.map((contato, idx) => (
                  <TableRow
                    key={contato.id}
                    hover
                    sx={{
                      backgroundColor:
                        idx % 2 === 0 ? "#ffffff" : "#fcfdff",
                      "&:hover": {
                        backgroundColor: "#f3f6fa !important",
                      },
                      "& td": { borderBottom: "1px solid #edf1f5" },
                      "&:last-child td": { borderBottom: "none" },
                    }}
                  >
                    <TableCell sx={{ color: "#6a7282", fontSize: 13 }}>
                      {contato.id}
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 500, color: "#111827", fontSize: 14 }}
                    >
                      {contato.nome}
                    </TableCell>
                    <TableCell sx={{ color: "#374151", fontSize: 13 }}>
                      {contato.telefone}
                    </TableCell>
                    <TableCell sx={{ color: "#374151", fontSize: 13 }}>
                      {contato.email || (
                        <Typography component="span" sx={{ color: "#9ca3af" }}>—</Typography>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#6a7282",
                        fontSize: 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(contato.dataCriacao).toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#6a7282",
                        fontSize: 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(contato.dataAtualizacao).toLocaleString(
                        "pt-BR",
                      )}
                    </TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(contato)}
                          sx={{ color: "#155dfc" }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remover">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDeleteDialog(contato)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ── Dialog criar / editar ────────────────────── */}
      <Dialog
        open={formState.open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
              overflow: "hidden",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 2,
            pt: 3,
            pb: 1,
          }}
        >
          <Logo size={80} showText variant="dark" />
          <Box sx={{flex: 1, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#111827", mt: 0 }}
            >
              {formState.editing ? "Editar Contato" : "Novo Contato"}
            </Typography>
            <Typography variant="body1" sx={{ color: "#6a7282", mt: 0.4 }}>
              {formState.editing
                ? `Atualizando dados de ${formState.editing.nome}`
                : "Preencha os campos abaixo para cadastrar"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 2, pb: 4 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Nome"
              value={formState.nome}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormState((prev) => ({ ...prev, nome: e.target.value }))
              }
              fullWidth
              required
            />
            <TextField
              label="Telefone"
              value={formState.telefone}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormState((prev) => ({ ...prev, telefone: e.target.value }))
              }
              fullWidth
              required
            />
            <TextField
              label="E-mail"
              value={formState.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormState((prev) => ({ ...prev, email: e.target.value }))
              }
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 3 }}>
          <Button variant="text" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              formState.saving || !formState.nome || !formState.telefone
            }
          >
            {formState.saving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Dialog confirmar exclusão ────────────────── */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="xs"
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmação de exclusão
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja remover o contato{" "}
            <strong>{contatoToDelete?.nome}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleCloseDeleteDialog}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Remover
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
