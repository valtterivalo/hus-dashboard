/**
 * @fileoverview footer with attribution and indicator listing.
 */
type Props = {
  indicators: { id: number; titleFi: string }[];
};

export function AppFooter({ indicators }: Props) {
  return (
    <footer className="border-t px-4 py-6 text-sm text-muted-foreground lg:px-6">
      <div className="space-y-3">
        <p>
          Tietolähde: Sotkanet / THL (Creative&nbsp;Commons Attribution 4.0, http://www.sotkanet.fi/)
        </p>
        <div>
          <div className="mb-1">Käytetyt indikaattorit:</div>
          <div className="space-y-1">
            {indicators.map((i) => (
              <div key={i.id}>{i.titleFi} (ID {i.id})</div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
