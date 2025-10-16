
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/mensualidades" | "/personas" | "/personas/[id]" | "/valoraciones";
		RouteParams(): {
			"/personas/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/mensualidades": Record<string, never>;
			"/personas": { id?: string };
			"/personas/[id]": { id: string };
			"/valoraciones": Record<string, never>
		};
		Pathname(): "/" | "/mensualidades" | "/mensualidades/" | "/personas" | "/personas/" | `/personas/${string}` & {} | `/personas/${string}/` & {} | "/valoraciones" | "/valoraciones/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}