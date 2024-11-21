import { AppNodeMissingInputs } from "@/types/appNode";
import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useState,
} from "react";

type FlowValidationContextType = {
	invalidInputs: AppNodeMissingInputs[];
	setInvalidInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
	clearErrors: () => void;
};

export const FlowValidationContext =
	createContext<FlowValidationContextType | null>(null);

export function FlowValidationContextProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [invalidInputs, setInvalidInputs] = useState<AppNodeMissingInputs[]>(
		[]
	);
	const clearErrors = () => {
		setInvalidInputs([]);
	};
	return (
		<FlowValidationContext.Provider
			value={{
				invalidInputs,
				setInvalidInputs,
				clearErrors,
			}}
		>
			{children}
		</FlowValidationContext.Provider>
	);
}
