import { RecoilRoot } from 'recoil';

function RecoilContextProvider({ children }: { children: React.ReactNode }) {
    return <RecoilRoot>{children}</RecoilRoot>;
}

export default RecoilContextProvider;
