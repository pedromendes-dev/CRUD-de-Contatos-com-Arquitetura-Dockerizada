interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
}

export function Logo({
  size = 40,
  className = '',
  showText = true,
  variant = 'default',
}: LogoProps) {
  const colorClass =
    variant === 'white'
      ? 'text-white'
      : variant === 'dark'
      ? 'text-gray-900'
      : 'text-blue-600';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={colorClass}
      >
        {/* Círculo externo */}
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3" fill="none" />

        {/* Nó central */}
        <circle cx="50" cy="50" r="8" fill="currentColor" />

        {/* Nós nos cantos — clientes/contatos */}
        <circle cx="30" cy="30" r="6" fill="currentColor" />
        <circle cx="70" cy="30" r="6" fill="currentColor" />
        <circle cx="30" cy="70" r="6" fill="currentColor" />
        <circle cx="70" cy="70" r="6" fill="currentColor" />

        {/* Linhas do centro para cada nó — conexões */}
        <line x1="50" y1="50" x2="30" y2="30" stroke="currentColor" strokeWidth="2" opacity="0.6" />
        <line x1="50" y1="50" x2="70" y2="30" stroke="currentColor" strokeWidth="2" opacity="0.6" />
        <line x1="50" y1="50" x2="30" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.6" />
        <line x1="50" y1="50" x2="70" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.6" />

        {/* Linhas horizontais — dados estruturados */}
        <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="2" opacity="0.4" />
        <line x1="30" y1="70" x2="70" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.4" />

        {/* Elementos dos pontos cardeais — campos de formulário/cadastro */}
        <rect x="20" y="47" width="12" height="2" fill="currentColor" opacity="0.5" rx="1" />
        <rect x="68" y="47" width="12" height="2" fill="currentColor" opacity="0.5" rx="1" />
        <rect x="47" y="20" width="2"  height="12" fill="currentColor" opacity="0.5" rx="1" />
        <rect x="47" y="68" width="2"  height="12" fill="currentColor" opacity="0.5" rx="1" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold text-lg ${colorClass}`}>SmartReg</span>
          <span className="text-xs text-gray-400">Sistema Inteligente</span>
        </div>
      )}
    </div>
  );
}
