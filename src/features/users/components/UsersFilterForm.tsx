import {Button} from "@/shared/ui/button.tsx";
import {Input} from "@/shared/ui/input.tsx";

interface PageFilterProps {
    onSubmit?: () => void;
}

export function UsersFilterForm({onSubmit}: PageFilterProps) {
    return (
        <>
            <form className="w-full p-1">
                <div className="flex flex-row gap-2">
                    <div className="columns-1 gap-1 text-start">
                        <label>Username</label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="username"
                            required
                        />
                    </div>
                    <div className="columns-1 gap-1 text-start">
                        <label>Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <div className="columns-1 gap-1 text-start">
                        <label>Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <div className="columns-1 gap-1 text-start">
                        <label>Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <div className="columns-1 gap-1 text-start">
                        <label>Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <div className="columns-1 gap-1 text-start">
                        <label>Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <div className="columns-1 gap-1 text-start">
                        <label>Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <div className="gap-1 flex items-end">
                        <Button variant="outline" onClick={onSubmit}>Search</Button>
                    </div>
                </div>
            </form>
        </>
    )
}