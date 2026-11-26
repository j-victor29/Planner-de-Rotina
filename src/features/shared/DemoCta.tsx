import page from './page.module.css';
import { useSession } from '@/app/providers/SessionContext';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

interface DemoCtaProps {
  title: string;
  text: string;
}

/** Convite para criar conta, mostrado no modo demonstração. */
export function DemoCta({ title, text }: DemoCtaProps) {
  const { openAuth } = useSession();
  return (
    <section className={page.cta} aria-label="Criar conta">
      <span className={page.ctaIcon} aria-hidden="true">
        <Icon name="sparkle" size={22} />
      </span>
      <div className={page.ctaText}>
        <h2 className={page.cardTitle}>{title}</h2>
        <p>{text}</p>
      </div>
      <div className={page.ctaActions}>
        <Button onClick={() => openAuth('register')}>Criar conta grátis</Button>
        <Button variant="secondary" onClick={() => openAuth('login')}>
          Já tenho conta
        </Button>
      </div>
    </section>
  );
}
