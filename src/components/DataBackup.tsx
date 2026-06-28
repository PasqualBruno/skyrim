import React, { useRef, useState } from 'react';
import { useCharacterStore } from '../store/useCharacterStore';
import { OrnamentalDivider } from './OrnamentalDivider';
import { Download, Upload, ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';

interface DataBackupProps {
  onSuccess: () => void;
}

export const DataBackup: React.FC<DataBackupProps> = ({ onSuccess }) => {
  const { characters, logs, currentCharacterId, importData } = useCharacterStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify({
        version: '1.0',
        characters,
        logs,
        currentCharacterId
      }, null, 2);
      
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `dragonborn_merits_${new Date().toISOString().slice(0,10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setSuccessMsg('Backup exportado com sucesso!');
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg('Falha ao exportar backup.');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files?.[0];
    if (!fileObj) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonContent = JSON.parse(e.target?.result as string);
        
        // Simple verification schema
        if (!jsonContent.characters || !Array.isArray(jsonContent.characters) || 
            !jsonContent.logs || !Array.isArray(jsonContent.logs)) {
          throw new Error('Formato de arquivo inválido. Chaves de dados ausentes.');
        }

        // Validate first character if present
        if (jsonContent.characters.length > 0) {
          const char = jsonContent.characters[0];
          if (!char.id || !char.name) {
            throw new Error('Dados de personagem inválidos ou corrompidos.');
          }
        }

        importData(
          jsonContent.characters, 
          jsonContent.logs, 
          jsonContent.currentCharacterId || (jsonContent.characters.length > 0 ? jsonContent.characters[0].id : null)
        );

        setSuccessMsg('Dados importados com sucesso! Livro atualizado.');
        setErrorMsg(null);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } catch (err: any) {
        setErrorMsg(err.message || 'Erro ao processar o arquivo de backup.');
        setSuccessMsg(null);
      }
    };
    reader.readAsText(fileObj);
  };

  return (
    <div className="flex flex-col h-full text-skyrim-ink animate-fadeIn">
      {/* HEADER */}
      <div className="text-center relative">
        <button
          onClick={onSuccess}
          className="absolute left-0 top-1 text-skyrim-ink/65 hover:text-skyrim-ink flex items-center gap-1 text-xs font-bold font-cinzel"
        >
          <ArrowLeft size={14} />
          <span>Voltar</span>
        </button>
        <h2 className="font-cinzel text-base font-bold tracking-widest text-skyrim-inkLight uppercase">
          Pergaminho de Backup
        </h2>
        <OrnamentalDivider light={true} className="mt-2" />
      </div>

      <div className="mt-4 flex-1 flex flex-col justify-between">
        {/* Description info */}
        <div className="text-xs font-serif text-skyrim-inkLight leading-relaxed space-y-3 p-3 border border-[#4a3f31]/15 rounded bg-[#ebdcb9]/20">
          <p>
            O Diário do Dragonborn é gravado nas runas da memória do seu navegador (<em className="italic">localStorage</em>). 
            Se você limpar os dados do navegador ou trocar de máquina, sua história poderá ser perdida.
          </p>
          <p className="font-bold">
            Recomenda-se realizar cópias frequentes do seu Pergaminho para garantir que sua saga nunca seja esquecida pelas eras de Skyrim!
          </p>
        </div>

        {/* Status Messages */}
        <div className="my-4 h-12 flex items-center justify-center">
          {errorMsg && (
            <div className="text-rose-800 bg-rose-900/10 border border-rose-900/20 px-3 py-2 rounded text-xs flex items-center gap-2 max-w-sm text-center">
              <ShieldAlert size={14} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="text-emerald-800 bg-emerald-950/5 border border-emerald-800/20 px-3 py-2 rounded text-xs flex items-center gap-2 max-w-sm text-center font-bold">
              <RefreshCw size={14} className="animate-spin flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Buttons Actions */}
        <div className="grid grid-cols-2 gap-4 pb-6">
          {/* EXPORT */}
          <button
            onClick={handleExport}
            className="
              flex flex-col items-center justify-center p-6 border border-[#4a3f31]/40 rounded bg-[#dfd0aa]/40 hover:bg-[#dfd0aa]/80 transition-all duration-300
              group hover:shadow-md select-none
            "
          >
            <Download size={32} className="text-[#4a3f31] mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-cinzel text-xs font-bold tracking-widest text-[#2b2318] uppercase">
              Exportar
            </span>
            <span className="text-[9px] text-[#4a3f31]/70 font-serif mt-1 text-center">
              Baixar JSON com todos os personagens
            </span>
          </button>

          {/* IMPORT */}
          <button
            onClick={handleImportClick}
            className="
              flex flex-col items-center justify-center p-6 border border-[#4a3f31]/40 rounded bg-[#dfd0aa]/40 hover:bg-[#dfd0aa]/80 transition-all duration-300
              group hover:shadow-md select-none
            "
          >
            <Upload size={32} className="text-[#4a3f31] mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-cinzel text-xs font-bold tracking-widest text-[#2b2318] uppercase">
              Importar
            </span>
            <span className="text-[9px] text-[#4a3f31]/70 font-serif mt-1 text-center">
              Carregar arquivo JSON de backup
            </span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
export default DataBackup;
