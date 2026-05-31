import { useEffect, useMemo, useState } from "react";
import {
  FaCheck,
  FaClock,
  FaCopy,
  FaExternalLinkAlt,
  FaLink,
  FaShareAlt,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";
import Modal from "../../components/ui/Modal";
import { Button, buttonVariants } from "@/components/ui/button";

interface LinkRecord {
  id: string;
  url: string;
  created_at: string;
}

const SHORT_DOMAIN = "lnk.freizin.me";

function buildShortUrl(id: string) {
  return `https://${SHORT_DOMAIN}/${id}`;
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  return `https://${trimmed}`;
}

export default function LinksManager() {
  const [sourceUrl, setSourceUrl] = useState("");
  const [links, setLinks] = useState<LinkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [createdLink, setCreatedLink] = useState<LinkRecord | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<LinkRecord | null>(null);

  const shortUrl = useMemo(() => {
    if (!createdLink) return "";

    return buildShortUrl(createdLink.id);
  }, [createdLink]);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("links")
      .select("id, url, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      setFeedback(`Erro ao carregar links: ${error.message}`);
    } else if (data) {
      setLinks(data as LinkRecord[]);
    }

    setLoading(false);
  };

  const handleShorten = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedUrl = normalizeUrl(sourceUrl);
    if (!normalizedUrl) {
      setFeedback("Insira uma URL válida antes de encurtar.");
      return;
    }

    setSaving(true);
    setFeedback(null);

    const { data, error } = await supabase
      .from("links")
      .insert([{ url: normalizedUrl }])
      .select("id, url, created_at")
      .single();

    if (error || !data) {
      setFeedback(
        `Não foi possível gerar o link: ${error?.message ?? "erro desconhecido"}`,
      );
      setSaving(false);
      return;
    }

    const insertedLink = data as LinkRecord;
    setCreatedLink(insertedLink);
    setLinks((current) =>
      [
        insertedLink,
        ...current.filter((item) => item.id !== insertedLink.id),
      ].slice(0, 10),
    );
    setSourceUrl("");
    setFeedback(
      `Link encurtado criado com sucesso: ${SHORT_DOMAIN}/${insertedLink.id}`,
    );
    setSaving(false);
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setFeedback("Link copiado para a área de transferência.");
    } catch {
      setFeedback("Não foi possível copiar o link automaticamente.");
    }
  };

  const handleShare = async (value: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Link encurtado",
          text: "Confira este link encurtado",
          url: value,
        });
        return;
      }

      await handleCopy(value);
    } catch {
      setFeedback(
        "Compartilhamento cancelado ou indisponível neste dispositivo.",
      );
    }
  };

  const confirmDelete = (link: LinkRecord) => {
    setLinkToDelete(link);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!linkToDelete) return;

    setDeleting(true);

    const { error } = await supabase
      .from("links")
      .delete()
      .eq("id", linkToDelete.id);

    setDeleting(false);
    setIsDeleteModalOpen(false);

    if (error) {
      setFeedback(`Erro ao excluir link: ${error.message}`);
      return;
    }

    setLinks((current) =>
      current.filter((item) => item.id !== linkToDelete.id),
    );
    setCreatedLink((current) =>
      current?.id === linkToDelete.id ? null : current,
    );
    setLinkToDelete(null);
    setFeedback("Link excluído com sucesso.");
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-white">Links</h2>
        <p className="text-gray-400">
          Crie URLs curtas no formato {SHORT_DOMAIN}/&lt;id&gt; e compartilhe
          com um clique.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <section className="bg-gray-900 border border-white/10 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <FaLink />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Novo link encurtado
              </h3>
              <p className="text-sm text-gray-500">
                Insira a URL original e o banco retornará o id final.
              </p>
            </div>
          </div>

          <form onSubmit={handleShorten} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                URL original
              </label>
              <input
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
                placeholder="https://exemplo.com/minha-pagina"
                className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 transition-colors"
                required
              />
            </div>

            <Button type="submit" size="lg" disabled={saving} className="px-5">
              {saving && <FaSpinner className="animate-spin" />}
              {!saving && <FaLink />}
              {saving ? "Encurtando..." : "Encurtar"}
            </Button>
          </form>

          {feedback && (
            <div className="mt-4 rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-300">
              {feedback}
            </div>
          )}

          {createdLink && (
            <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4 space-y-4">
              <div className="flex items-center gap-3 text-green-400">
                <FaCheck />
                <p className="font-medium">URL encurtada criada.</p>
              </div>

              <div className="rounded-lg border border-gray-800 bg-gray-950/60 p-4 space-y-2">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  URL final
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-white font-mono hover:underline"
                  >
                    {SHORT_DOMAIN}/{createdLink.id}
                  </a>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleCopy(shortUrl)}
                    >
                      <FaCopy />
                      Copiar
                    </Button>
                    <Button type="button" onClick={() => handleShare(shortUrl)}>
                      <FaShareAlt />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-800 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Destino original
                </p>
                <a
                  href={createdLink.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline break-all"
                >
                  {createdLink.url}
                </a>
              </div>
            </div>
          )}
        </section>

        <section className="bg-gray-900 border border-white/10 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Últimos links</h3>
              <p className="text-sm text-gray-500">
                Os 10 registros mais recentes na tabela links.
              </p>
            </div>
            <Button type="button" variant="ghost" onClick={fetchLinks}>
              Atualizar
            </Button>
          </div>

          {loading ? (
            <div className="text-gray-400">Carregando...</div>
          ) : links.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-800 p-6 text-center text-gray-500">
              Nenhum link encontrado ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((link) => {
                const finalUrl = buildShortUrl(link.id);
                const displayUrl = `${SHORT_DOMAIN}/${link.id}`;

                return (
                  <article
                    key={link.id}
                    className="rounded-lg border border-gray-800 bg-black/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="min-w-0">
                        <a
                          href={finalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-white font-mono hover:underline break-all"
                        >
                          {displayUrl}
                        </a>
                        <p className="mt-1 text-sm text-gray-500 break-all">
                          {link.url}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-2 text-xs text-gray-500 shrink-0">
                        <FaClock />
                        {new Date(link.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleCopy(finalUrl)}
                      >
                        <FaCopy />
                        Copiar
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleShare(finalUrl)}
                      >
                        <FaShareAlt />
                        Compartilhar
                      </Button>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className={buttonVariants({ variant: "outline" })}
                      >
                        <FaExternalLinkAlt />
                        Abrir origem
                      </a>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => confirmDelete(link)}
                      >
                        <FaTrash />
                        Deletar
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (deleting) return;
          setIsDeleteModalOpen(false);
          setLinkToDelete(null);
        }}
        title="Excluir Link"
        type="danger"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                if (deleting) return;
                setIsDeleteModalOpen(false);
                setLinkToDelete(null);
              }}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={executeDelete}
              disabled={deleting}
            >
              {deleting && <FaSpinner className="animate-spin" />}
              {!deleting && <FaTrash />}
              Excluir
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p>Tem certeza que deseja excluir este link encurtado?</p>
          <div className="rounded-lg border border-gray-800 bg-black/30 p-3 text-sm text-gray-300 break-all">
            {linkToDelete ? `${SHORT_DOMAIN}/${linkToDelete.id}` : ""}
          </div>
          <p className="text-sm text-red-400/80">
            Esta ação não pode ser desfeita.
          </p>
        </div>
      </Modal>
    </div>
  );
}
