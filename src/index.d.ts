declare module "discord-akairo" {
	import {
		BufferResolvable,
		Client,
		ClientOptions,
		Collection,
		Message,
		MessageAttachment,
		MessageEmbed,
		MessageAdditions,
		MessageEditOptions,
		MessageOptions,
		SplitOptions,
		User,
		UserResolvable,
		GuildMember,
		Channel,
		Role,
		Emoji,
		Guild,
		TextChannel,
		PermissionResolvable,
		Snowflake,
		CommandInteraction
	} from "discord.js";

	import { EventEmitter } from "events";
	import { Stream } from "stream";

	module "discord.js" {
		export interface Message {
			util?: CommandUtil;
		}
	}

	export class AkairoError extends Error {
		public code: string;
	}

	export class AkairoClient extends Client {
		public constructor(
			options?: AkairoOptions & ClientOptions,
			clientOptions?: ClientOptions
		);

		public ownerID: Snowflake | Snowflake[];
		public superUserID: Snowflake | Snowflake[];
		public util: ClientUtil;

		public isOwner(user: UserResolvable): boolean;
		public isSuperUser(user: UserResolvable): boolean;
	}

	export class AkairoHandler extends EventEmitter {
		public constructor(client: AkairoClient, options: AkairoHandlerOptions);

		public automateCategories: boolean;
		public extensions: Set<string>;
		public categories: Collection<string, Category<string, AkairoModule>>;
		public classToHandle: Function;
		public client: AkairoClient;
		public directory: string;
		public loadFilter: LoadPredicate;
		public modules: Collection<string, AkairoModule>;

		public deregister(mod: AkairoModule): void;
		public findCategory(name: string): Category<string, AkairoModule>;
		public load(thing: string | Function, isReload?: boolean): AkairoModule;
		public loadAll(directory?: string, filter?: LoadPredicate): this;
		public register(mod: AkairoModule, filepath?: string): void;
		public reload(id: string): AkairoModule;
		public reloadAll(): this;
		public remove(id: string): AkairoModule;
		public removeAll(): this;
		public on(event: "remove", listener: (mod: AkairoModule) => any): this;
		public on(
			event: "load",
			listener: (mod: AkairoModule, isReload: boolean) => any
		): this;

		public static readdirRecursive(directory: string): string[];
	}

	export class AkairoModule {
		public constructor(id: string, options?: AkairoModuleOptions);

		public category: Category<string, AkairoModule>;
		public categoryID: string;
		public client: AkairoClient;
		public filepath: string;
		public handler: AkairoHandler;
		public id: string;

		public reload(): this;
		public remove(): this;
	}

	export class Argument {
		public constructor(command: Command, options: ArgumentOptions);

		public readonly client: AkairoClient;
		public command: Command;
		public default: DefaultValueSupplier | any;
		public description: string | any;
		public readonly handler: CommandHandler;
		public index?: number;
		public limit: number;
		public match: ArgumentMatch;
		public multipleFlags: boolean;
		public flag?: string | string[];
		public otherwise?:
			| string
			| MessageOptions
			| MessageAdditions
			| OtherwiseContentSupplier;
		public prompt?: ArgumentPromptOptions | boolean;
		public type: ArgumentType | ArgumentTypeCaster;
		public unordered: boolean | number | number[];

		public allow(message: Message): boolean;
		public cast(message: Message, phrase: string): Promise<any>;
		public collect(
			message: Message,
			commandInput?: string
		): Promise<Flag | any>;
		public process(message: Message, phrase: string): Promise<any>;

		public static cast(
			type: ArgumentType | ArgumentTypeCaster,
			resolver: TypeResolver,
			message: Message,
			phrase: string
		): Promise<any>;
		public static compose(
			...types: (ArgumentType | ArgumentTypeCaster)[]
		): ArgumentTypeCaster;
		public static composeWithFailure(
			...types: (ArgumentType | ArgumentTypeCaster)[]
		): ArgumentTypeCaster;
		public static isFailure(
			value: any
		): value is null | undefined | (Flag & { value: any });
		public static product(
			...types: (ArgumentType | ArgumentTypeCaster)[]
		): ArgumentTypeCaster;
		public static range(
			type: ArgumentType | ArgumentTypeCaster,
			min: number,
			max: number,
			inclusive?: boolean
		): ArgumentTypeCaster;
		public static tagged(
			type: ArgumentType | ArgumentTypeCaster,
			tag?: any
		): ArgumentTypeCaster;
		public static taggedUnion(
			...types: (ArgumentType | ArgumentTypeCaster)[]
		): ArgumentTypeCaster;
		public static taggedWithInput(
			type: ArgumentType | ArgumentTypeCaster,
			tag?: any
		): ArgumentTypeCaster;
		public static union(
			...types: (ArgumentType | ArgumentTypeCaster)[]
		): ArgumentTypeCaster;
		public static validate(
			type: ArgumentType | ArgumentTypeCaster,
			predicate: ParsedValuePredicate
		): ArgumentTypeCaster;
		public static withInput(
			type: ArgumentType | ArgumentTypeCaster
		): ArgumentTypeCaster;
	}

	export class Category<K, V> extends Collection<K, V> {
		public constructor(id: string, iterable?: Iterable<[K, V][]>);

		public id: string;

		public reloadAll(): this;
		public removeAll(): this;
	}

	export class ClientUtil {
		public constructor(client: AkairoClient);

		public readonly client: AkairoClient;

		public attachment(
			file: BufferResolvable | Stream,
			name?: string
		): MessageAttachment;
		public checkChannel(
			text: string,
			channel: Channel,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): boolean;
		public checkEmoji(
			text: string,
			emoji: Emoji,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): boolean;
		public checkGuild(
			text: string,
			guild: Guild,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): boolean;
		public checkMember(
			text: string,
			member: GuildMember,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): boolean;
		public checkRole(
			text: string,
			role: Role,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): boolean;
		public checkUser(
			text: string,
			user: User,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): boolean;
		public collection<K, V>(iterable?: Iterable<[K, V][]>): Collection<K, V>;
		public compareStreaming(
			oldMember: GuildMember,
			newMember: GuildMember
		): number;
		public embed(data?: object): MessageEmbed;
		public fetchMember(
			guild: Guild,
			id: string,
			cache?: boolean
		): Promise<GuildMember>;
		public resolveChannel(
			text: string,
			channels: Collection<Snowflake, Channel>,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): Channel;
		public resolveChannels(
			text: string,
			channels: Collection<Snowflake, Channel>,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): Collection<Snowflake, Channel>;
		public resolveEmoji(
			text: string,
			emojis: Collection<Snowflake, Emoji>,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): Emoji;
		public resolveEmojis(
			text: string,
			emojis: Collection<Snowflake, Emoji>,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): Collection<Snowflake, Emoji>;
		public resolveGuild(
			text: string,
			guilds: Collection<Snowflake, Guild>,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): Guild;
		public resolveGuilds(
			text: string,
			guilds: Collection<Snowflake, Guild>,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): Collection<Snowflake, Guild>;
		public resolveMember(
			text: string,
			members: Collection<Snowflake, GuildMember>,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): GuildMember;
		public resolveMembers(
			text: string,
			members: Collection<Snowflake, GuildMember>,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): Collection<Snowflake, GuildMember>;
		public resolvePermissionNumber(number: number): string[];
		public resolveRole(
			text: string,
			roles: Collection<Snowflake, Role>,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): Role;
		public resolveRoles(
			text: string,
			roles: Collection<Snowflake, Role>,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): Collection<Snowflake, Role>;
		public resolveUser(
			text: string,
			users: Collection<Snowflake, User>,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): User;
		public resolveUsers(
			text: string,
			users: Collection<Snowflake, User>,
			caseSensitive?: boolean,
			wholeWord?: boolean
		): Collection<Snowflake, User>;
	}
	export class AkairoMessage {
		public constructor(
			client: AkairoClient,
			interaction: CommandInteraction,
			{ slash, replied }: { slash?: boolean; replied?: boolean }
		);
		public interaction: CommandInteraction;
		public _message: Message | null;
		public channel: TextChannel;
		public guild: Guild;
		public member: GuildMember;
		public client: AkairoClient;
		public replied: boolean;
		public author: User;
		public id: string;
		public content: string;
		public send(...options: any): Promise<Message>;
		public reply(...options: any): Promise<Message>;
	}
	export class Command extends AkairoModule {
		public constructor(id: string, options?: CommandOptions);
		public slash?: boolean;
		public slashEmphemeral?: boolean;
		public aliases: string[];
		public argumentDefaults: DefaultArgumentOptions;
		public quoted: boolean;
		public category: Category<string, Command>;
		public channel?: string;
		public client: AkairoClient;
		public clientPermissions:
			| PermissionResolvable
			| PermissionResolvable[]
			| MissingPermissionSupplier;
		public cooldown?: number;
		public description: any;
		public editable: boolean;
		public filepath: string;
		public handler: CommandHandler;
		public id: string;
		public lock?: KeySupplier;
		public locker?: Set<string>;
		public ignoreCooldown?: Snowflake | Snowflake[] | IgnoreCheckPredicate;
		public ignorePermissions?: Snowflake | Snowflake[] | IgnoreCheckPredicate;
		public ownerOnly: boolean;
		public superUserOnly: boolean;
		public prefix?: string | string[] | PrefixSupplier;
		public ratelimit: number;
		public slashOptions?: any | any[];
		public regex: RegExp | RegexSupplier;
		public typing: boolean;
		public userPermissions:
			| PermissionResolvable
			| PermissionResolvable[]
			| MissingPermissionSupplier;
		public onlyNsfw: boolean;
		public before(message: Message): any;
		public condition(message: Message): boolean;
		public exec(message: Message, args: any): any;
		public execSlash(message: AkairoMessage, args: any): any;
		public parse(message: Message, content: string): Promise<Flag | any>;
		public reload(): this;
		public remove(): this;
	}

	export class CommandHandler extends AkairoHandler {
		public constructor(client: AkairoClient, options: CommandHandlerOptions);

		public aliasReplacement?: RegExp;
		public aliases: Collection<string, string>;
		public allowMention: boolean | MentionPrefixPredicate;
		public argumentDefaults: DefaultArgumentOptions;
		public blockBots: boolean;
		public blockClient: boolean;
		public categories: Collection<string, Category<string, Command>>;
		public classToHandle: typeof Command;
		public client: AkairoClient;
		public commandUtil: boolean;
		public commandUtilLifetime: number;
		public commandUtils: Collection<string, CommandUtil>;
		public commandUtilSweepInterval: number;
		public cooldowns: Collection<string, { [id: string]: CooldownData }>;
		public defaultCooldown: number;
		public directory: string;
		public fetchMembers: boolean;
		public handleEdits: boolean;
		public ignoreCooldown: Snowflake | Snowflake[] | IgnoreCheckPredicate;
		public ignorePermissions: Snowflake | Snowflake[] | IgnoreCheckPredicate;
		public inhibitorHandler?: InhibitorHandler;
		public modules: Collection<string, Command>;
		public prefix: string | string[] | PrefixSupplier;
		public prefixes: Collection<string | PrefixSupplier, Set<string>>;
		public prompts: Collection<string, Set<string>>;
		public resolver: TypeResolver;
		public storeMessage: boolean;
		public autoDefer: boolean;

		public add(filename: string): Command;
		public addPrompt(channel: Channel, user: User): void;
		public deregister(command: Command): void;
		public emitError(err: Error, message: Message, command?: Command): void;
		public findCategory(name: string): Category<string, Command>;
		public findCommand(name: string): Command;
		public handle(message: Message): Promise<boolean | null>;
		public handleDirectCommand(
			message: Message,
			content: string,
			command: Command,
			ignore?: boolean
		): Promise<boolean | null>;
		public handleRegexAndConditionalCommands(
			message: Message
		): Promise<boolean>;
		public handleRegexCommands(message: Message): Promise<boolean>;
		public handleConditionalCommands(message: Message): Promise<boolean>;
		public hasPrompt(channel: Channel, user: User): boolean;
		public load(thing: string | Function, isReload?: boolean): Command;
		public loadAll(directory?: string, filter?: LoadPredicate): this;
		public parseCommand(message: Message): Promise<ParsedComponentData>;
		public parseCommandOverwrittenPrefixes(
			message: Message
		): Promise<ParsedComponentData>;
		public parseMultiplePrefixes(
			message: Message,
			prefixes: [string, Set<string> | null]
		): ParsedComponentData;
		public parseWithPrefix(
			message: Message,
			prefix: string,
			associatedCommands?: Set<string>
		): ParsedComponentData;
		public register(command: Command, filepath?: string): void;
		public reload(id: string): Command;
		public reloadAll(): this;
		public remove(id: string): Command;
		public removeAll(): this;
		public removePrompt(channel: Channel, user: User): void;
		public runAllTypeInhibitors(message: Message): Promise<boolean>;
		public runPermissionChecks(
			message: Message,
			command: Command
		): Promise<boolean>;
		public runPreTypeInhibitors(message: Message): Promise<boolean>;
		public runPostTypeInhibitors(
			message: Message,
			command: Command
		): Promise<boolean>;
		public runCooldowns(message: Message, command: Command): boolean;
		public runCommand(
			message: Message,
			command: Command,
			args: any
		): Promise<void>;
		public useInhibitorHandler(inhibitorHandler: InhibitorHandler): this;
		public useListenerHandler(ListenerHandler: ListenerHandler): this;
		public on(event: "remove", listener: (command: Command) => any): this;
		public on(
			event: "load",
			listener: (command: Command, isReload: boolean) => any
		): this;
		public on(
			event: "commandBlocked",
			listener: (message: Message, command: Command, reason: string) => any
		): this;
		public on(
			event: "commandBreakout",
			listener: (
				message: Message,
				command: Command,
				breakMessage: Message
			) => any
		): this;
		public on(
			event: "commandCancelled",
			listener: (
				message: Message,
				command: Command,
				retryMessage?: Message
			) => any
		): this;
		public on(
			event: "commandFinished",
			listener: (
				message: Message,
				command: Command,
				args: any,
				returnValue: any
			) => any
		): this;
		public on(
			event: "commandLocked",
			listener: (message: Message, command: Command) => any
		): this;
		public on(
			event: "commandStarted",
			listener: (message: Message, command: Command, args: any) => any
		): this;
		public on(
			event: "cooldown",
			listener: (message: Message, command: Command, remaining: number) => any
		): this;
		public on(
			event: "error",
			listener: (error: Error, message: Message, command?: Command) => any
		): this;
		public on(
			event: "inPrompt" | "messageInvalid",
			listener: (message: Message) => any
		): this;
		public on(
			event: "messageBlocked",
			listener: (message: Message, reason: string) => any
		): this;
		public on(
			event: "missingPermissions",
			listener: (
				message: Message,
				command: Command,
				type: "client" | "user",
				missing?: any
			) => any
		): this;
		public on(
			event: "slashError",
			listener: (error: Error, message: AkairoMessage, command: Command) => any
		): this;
		public on(
			event: "slashBlocked",
			listener: (
				interaction: CommandInteraction,
				command: Command,
				type: "owner" | "superuser"
			) => any
		): this;
		public on(
			event: "slashStarted",
			listener: (interaction: CommandInteraction, command: Command) => any
		): this;
		public on(
			event: "slashNotFound",
			listener: (interaction: CommandInteraction) => any
		): this;
		public on(
			event: "slashGuildOnly",
			listener: (interaction: CommandInteraction) => any
		): this;
		public on(
			event: "slashMissingPermissions",
			listener: (
				interaction: CommandInteraction,
				command: Command,
				type: "user" | "client",
				missing?: any
			) => any
		): this;
	}

	export class CommandUtil {
		public constructor(handler: CommandHandler, message: Message);

		public handler: CommandHandler;
		public lastResponse?: Message;
		public message: Message;
		public messages?: Collection<Snowflake, Message>;
		public parsed?: ParsedComponentData;
		public shouldEdit: boolean;

		public addMessage(message: Message | Message[]): Message | Message[];
		public edit(
			content?: string,
			options?: MessageEmbed | MessageEditOptions
		): Promise<Message>;
		public edit(options?: MessageOptions | MessageAdditions): Promise<Message>;
		public reply(
			content?: string,
			options?: MessageOptions | MessageAdditions
		): Promise<Message>;
		public reply(
			content?: string,
			options?: (MessageOptions & { split?: false }) | MessageAdditions
		): Promise<Message>;
		public reply(
			content?: string,
			options?:
				| (MessageOptions & { split: true | SplitOptions })
				| MessageAdditions
		): Promise<Message[]>;
		public reply(options?: MessageOptions | MessageAdditions): Promise<Message>;
		public reply(
			options?: (MessageOptions & { split?: false }) | MessageAdditions
		): Promise<Message>;
		public reply(
			options?:
				| (MessageOptions & { split: true | SplitOptions })
				| MessageAdditions
		): Promise<Message[]>;
		public send(
			content?: string,
			options?: MessageOptions | MessageAdditions
		): Promise<Message>;
		public send(
			content?: string,
			options?: (MessageOptions & { split?: false }) | MessageAdditions
		): Promise<Message>;
		public send(
			content?: string,
			options?:
				| (MessageOptions & { split: true | SplitOptions })
				| MessageAdditions
		): Promise<Message[]>;
		public send(options?: MessageOptions | MessageAdditions): Promise<Message>;
		public send(
			options?: (MessageOptions & { split?: false }) | MessageAdditions
		): Promise<Message>;
		public send(
			options?:
				| (MessageOptions & { split: true | SplitOptions })
				| MessageAdditions
		): Promise<Message[]>;
		public sendNew(
			content?: string,
			options?: MessageOptions | MessageAdditions
		): Promise<Message>;
		public sendNew(
			content?: string,
			options?: (MessageOptions & { split?: false }) | MessageAdditions
		): Promise<Message>;
		public sendNew(
			content?: string,
			options?:
				| (MessageOptions & { split: true | SplitOptions })
				| MessageAdditions
		): Promise<Message[]>;
		public sendNew(
			options?: MessageOptions | MessageAdditions
		): Promise<Message>;
		public sendNew(
			options?: (MessageOptions & { split?: false }) | MessageAdditions
		): Promise<Message>;
		public sendNew(
			options?:
				| (MessageOptions & { split: true | SplitOptions })
				| MessageAdditions
		): Promise<Message[]>;
		public setEditable(state: boolean): this;
		public setLastResponse(message: Message | Message[]): Message;

		public static transformOptions(
			content?: string,
			options?: MessageOptions | MessageAdditions
		): any[];
	}

	export class Flag {
		public constructor(type: string, data: object);

		public type: string;

		public static cancel(): Flag;
		public static continue(
			command: string,
			ignore?: boolean,
			rest?: string
		): Flag & { command: string; ignore: boolean; rest: string };
		public static retry(message: Message): Flag & { message: Message };
		public static fail(value: any): Flag & { value: any };
		public static is(value: any, type: "cancel"): value is Flag;
		public static is(
			value: any,
			type: "continue"
		): value is Flag & { command: string; ignore: boolean; rest: string };
		public static is(
			value: any,
			type: "retry"
		): value is Flag & { message: Message };
		public static is(value: any, type: "fail"): value is Flag & { value: any };
		public static is(value: any, type: string): value is Flag;
	}

	export class Inhibitor extends AkairoModule {
		public constructor(id: string, options?: InhibitorOptions);

		public category: Category<string, Inhibitor>;
		public client: AkairoClient;
		public filepath: string;
		public handler: InhibitorHandler;
		public id: string;
		public reason: string;
		public type: string;

		public exec(
			message: Message,
			command?: Command
		): boolean | Promise<boolean>;
		public reload(): this;
		public remove(): this;
	}

	export class InhibitorHandler extends AkairoHandler {
		public constructor(client: AkairoClient, options: AkairoHandlerOptions);

		public categories: Collection<string, Category<string, Inhibitor>>;
		public classToHandle: typeof Inhibitor;
		public client: AkairoClient;
		public directory: string;
		public modules: Collection<string, Inhibitor>;

		public deregister(inhibitor: Inhibitor): void;
		public findCategory(name: string): Category<string, Inhibitor>;
		public load(thing: string | Function): Inhibitor;
		public loadAll(directory?: string, filter?: LoadPredicate): this;
		public register(inhibitor: Inhibitor, filepath?: string): void;
		public reload(id: string): Inhibitor;
		public reloadAll(): this;
		public remove(id: string): Inhibitor;
		public removeAll(): this;
		public test(
			type: "all" | "pre" | "post",
			message: Message,
			command?: Command
		): Promise<string | void>;
		public on(event: "remove", listener: (inhibitor: Inhibitor) => any): this;
		public on(
			event: "load",
			listener: (inhibitor: Inhibitor, isReload: boolean) => any
		): this;
	}

	export class Listener extends AkairoModule {
		public constructor(id: string, options?: ListenerOptions);

		public category: Category<string, Listener>;
		public client: AkairoClient;
		public emitter: string | EventEmitter;
		public event: string;
		public filepath: string;
		public handler: ListenerHandler;
		public type: string;

		public exec(...args: any[]): any;
		public reload(): this;
		public remove(): this;
	}

	export class ListenerHandler extends AkairoHandler {
		public constructor(client: AkairoClient, options: AkairoHandlerOptions);

		public categories: Collection<string, Category<string, Listener>>;
		public classToHandle: typeof Listener;
		public client: AkairoClient;
		public directory: string;
		public emitters: Collection<string, EventEmitter>;
		public modules: Collection<string, Listener>;

		public add(filename: string): Listener;
		public addToEmitter(id: string): Listener;
		public deregister(listener: Listener): void;
		public findCategory(name: string): Category<string, Listener>;
		public load(thing: string | Function): Listener;
		public loadAll(directory?: string, filter?: LoadPredicate): this;
		public register(listener: Listener, filepath?: string): void;
		public reload(id: string): Listener;
		public reloadAll(): this;
		public remove(id: string): Listener;
		public removeAll(): this;
		public removeFromEmitter(id: string): Listener;
		public setEmitters(emitters: { [x: string]: EventEmitter }): void;
		public on(event: "remove", listener: (listener: Listener) => any): this;
		public on(
			event: "load",
			listener: (listener: Listener, isReload: boolean) => any
		): this;
	}

	export class Task extends AkairoModule {
		public constructor(id: string, options?: TaskOptions);

		public category: Category<string, Task>;
		public client: AkairoClient;
		public emitter: string | EventEmitter;
		public event: string;
		public filepath: string;
		public handler: TaskHandler;
		public type: string;

		public exec(...args: any[]): any;
		public reload(): this;
		public remove(): this;
	}

	export class TaskHandler extends AkairoHandler {
		public constructor(client: AkairoClient, options: AkairoHandlerOptions);

		public categories: Collection<string, Category<string, Task>>;
		public classToHandle: typeof Task;
		public client: AkairoClient;
		public directory: string;
		public emitters: Collection<string, EventEmitter>;
		public modules: Collection<string, Task>;

		public add(filename: string): Task;
		public addToEmitter(id: string): Task;
		public deregister(task: Task): void;
		public findCategory(name: string): Category<string, Task>;
		public load(thing: string | Function): Task;
		public loadAll(directory?: string, filter?: LoadPredicate): this;
		public register(task: Task, filepath?: string): void;
		public reload(id: string): Task;
		public reloadAll(): this;
		public remove(id: string): Task;
		public startAll(): void;
		public removeAll(): this;
		public on(event: "remove", task: (task: Task) => any): this;
		public on(
			event: "load",
			task: (task: Task, isReload: boolean) => any
		): this;
	}

	export class TypeResolver {
		public constructor(handler: CommandHandler);

		public client: AkairoClient;
		public commandHandler: CommandHandler;
		public inhibitorHandler?: InhibitorHandler;
		public listenerHandler?: ListenerHandler;
		public types: Collection<string, ArgumentTypeCaster>;

		public addBuiltInTypes(): void;
		public addType(name: string, fn: ArgumentTypeCaster): this;
		public addTypes(types: { [x: string]: ArgumentTypeCaster }): this;
		public type(name: string): ArgumentTypeCaster;
	}

	export class Util {
		public static isEventEmitter(value: any): boolean;
		public static isPromise(value: any): boolean;
	}

	export interface AkairoHandlerOptions {
		automateCategories?: boolean;
		classToHandle?: Function;
		directory?: string;
		extensions?: string[] | Set<string>;
		loadFilter?: LoadPredicate;
	}

	export interface AkairoModuleOptions {
		category?: string;
	}

	export interface AkairoOptions {
		ownerID?: Snowflake | Snowflake[];
		superUserID?: Snowflake | Snowflake[];
	}

	export interface DefaultArgumentOptions {
		prompt?: ArgumentPromptOptions;
		otherwise?:
			| string
			| MessageOptions
			| MessageAdditions
			| OtherwiseContentSupplier;
		modifyOtherwise?: OtherwiseContentModifier;
	}

	export interface ArgumentOptions {
		default?: DefaultValueSupplier | any;
		description?: string | any | any[];
		id?: string;
		index?: number;
		limit?: number;
		match?: ArgumentMatch;
		modifyOtherwise?: OtherwiseContentModifier;
		multipleFlags?: boolean;
		flag?: string | string[];
		otherwise?:
			| string
			| MessageOptions
			| MessageAdditions
			| OtherwiseContentSupplier;
		prompt?: ArgumentPromptOptions | boolean;
		type?: ArgumentType | ArgumentTypeCaster;
		unordered?: boolean | number | number[];
	}

	export interface ArgumentPromptData {
		infinite: boolean;
		message: Message;
		retries: number;
		phrase: string;
		failure: void | (Flag & { value: any });
	}

	export interface ArgumentPromptOptions {
		breakout?: boolean;
		cancel?: string | MessageOptions | MessageAdditions | PromptContentSupplier;
		cancelWord?: string;
		ended?: string | MessageOptions | MessageAdditions | PromptContentSupplier;
		infinite?: boolean;
		limit?: number;
		modifyCancel?: PromptContentModifier;
		modifyEnded?: PromptContentModifier;
		modifyRetry?: PromptContentModifier;
		modifyStart?: PromptContentModifier;
		modifyTimeout?: PromptContentModifier;
		optional?: boolean;
		retries?: number;
		retry?: string | MessageOptions | MessageAdditions | PromptContentSupplier;
		start?: string | MessageOptions | MessageAdditions | PromptContentSupplier;
		stopWord?: string;
		time?: number;
		timeout?:
			| string
			| MessageOptions
			| MessageAdditions
			| PromptContentSupplier;
	}

	export interface ArgumentRunnerState {
		index: number;
		phraseIndex: number;
		usedIndices: Set<number>;
	}

	export interface CommandOptions extends AkairoModuleOptions {
		slash?: boolean;
		aliases?: string[];
		args?: ArgumentOptions[] | ArgumentGenerator;
		argumentDefaults?: DefaultArgumentOptions;
		before?: BeforeAction;
		channel?: "guild" | "dm";
		clientPermissions?:
			| PermissionResolvable
			| PermissionResolvable[]
			| MissingPermissionSupplier;
		condition?: ExecutionPredicate;
		cooldown?: number;
		description?: string | any | any[];
		editable?: boolean;
		flags?: string[];
		ignoreCooldown?: Snowflake | Snowflake[] | IgnoreCheckPredicate;
		ignorePermissions?: Snowflake | Snowflake[] | IgnoreCheckPredicate;
		lock?: KeySupplier | "guild" | "channel" | "user";
		optionFlags?: string[];
		slashOptions?: any | any[];
		ownerOnly?: boolean;
		superUserOnly?: boolean;
		prefix?: string | string[] | PrefixSupplier;
		ratelimit?: number;
		regex?: RegExp | RegexSupplier;
		separator?: string;
		typing?: boolean;
		userPermissions?:
			| PermissionResolvable
			| PermissionResolvable[]
			| MissingPermissionSupplier;
		quoted?: boolean;
		slashEmphemeral?: boolean;
		onlyNsfw?: boolean;
	}

	export interface CommandHandlerOptions extends AkairoHandlerOptions {
		aliasReplacement?: RegExp;
		allowMention?: boolean | MentionPrefixPredicate;
		argumentDefaults?: DefaultArgumentOptions;
		blockBots?: boolean;
		blockClient?: boolean;
		commandUtil?: boolean;
		commandUtilLifetime?: number;
		commandUtilSweepInterval?: number;
		defaultCooldown?: number;
		fetchMembers?: boolean;
		handleEdits?: boolean;
		ignoreCooldown?: Snowflake | Snowflake[] | IgnoreCheckPredicate;
		ignorePermissions?: Snowflake | Snowflake[] | IgnoreCheckPredicate;
		prefix?: string | string[] | PrefixSupplier;
		storeMessages?: boolean;
		autoDefer?: boolean;
	}

	export interface ContentParserResult {
		all: StringData[];
		phrases: StringData[];
		flags: StringData[];
		optionFlags: StringData[];
	}

	export interface CooldownData {
		end: number;
		timer: NodeJS.Timer;
		uses: number;
	}

	export interface FailureData {
		phrase: string;
		failure: void | (Flag & { value: any });
	}

	export interface InhibitorOptions extends AkairoModuleOptions {
		reason?: string;
		type?: string;
		priority?: number;
	}

	export interface ListenerOptions extends AkairoModuleOptions {
		emitter: string | EventEmitter;
		event: string;
		type?: string;
	}

	export interface TaskOptions extends AkairoModuleOptions {
		delay: number;
		runOnStart?: boolean;
	}

	export interface ParsedComponentData {
		afterPrefix?: string;
		alias?: string;
		command?: Command;
		content?: string;
		prefix?: string;
	}

	export type StringData =
		| {
				type: "Phrase";
				value: string;
				raw: string;
		  }
		| {
				type: "Flag";
				key: string;
				raw: string;
		  }
		| {
				type: "OptionFlag";
				key: string;
				value: string;
				raw: string;
		  };

	export type ArgumentMatch =
		| "phrase"
		| "flag"
		| "option"
		| "rest"
		| "separate"
		| "text"
		| "content"
		| "restContent"
		| "none";

	export type ArgumentType =
		| "string"
		| "lowercase"
		| "uppercase"
		| "charCodes"
		| "number"
		| "integer"
		| "bigint"
		| "emojint"
		| "url"
		| "date"
		| "color"
		| "user"
		| "users"
		| "member"
		| "members"
		| "relevant"
		| "relevants"
		| "channel"
		| "channels"
		| "textChannel"
		| "textChannels"
		| "voiceChannel"
		| "voiceChannels"
		| "categoryChannel"
		| "categoryChannels"
		| "newsChannel"
		| "newsChannels"
		| "storeChannel"
		| "storeChannels"
		| "role"
		| "roles"
		| "emoji"
		| "emojis"
		| "guild"
		| "guilds"
		| "message"
		| "guildMessage"
		| "relevantMessage"
		| "invite"
		| "userMention"
		| "memberMention"
		| "channelMention"
		| "roleMention"
		| "emojiMention"
		| "commandAlias"
		| "command"
		| "inhibitor"
		| "listener"
		| (string | string[])[]
		| RegExp
		| string;

	export type ArgumentGenerator = (
		message: Message,
		parsed: ContentParserResult,
		state: ArgumentRunnerState
	) => IterableIterator<ArgumentOptions | Flag>;

	export type ArgumentTypeCaster = (message: Message, phrase: string) => any;

	export type BeforeAction = (message: Message) => any;

	export type DefaultValueSupplier = (
		message: Message,
		data: FailureData
	) => any;

	export type ExecutionPredicate = (message: Message) => boolean;

	export type IgnoreCheckPredicate = (
		message: Message,
		command: Command
	) => boolean;

	export type KeySupplier = (message: Message, args: any) => string;

	export type LoadPredicate = (filepath: string) => boolean;

	export type MentionPrefixPredicate = (
		message: Message
	) => boolean | Promise<boolean>;

	export type MissingPermissionSupplier = (
		message: Message
	) => Promise<any> | any;

	export type OtherwiseContentModifier = (
		message: Message,
		text: string,
		data: FailureData
	) =>
		| string
		| MessageOptions
		| MessageAdditions
		| Promise<string | MessageOptions | MessageAdditions>;

	export type OtherwiseContentSupplier = (
		message: Message,
		data: FailureData
	) =>
		| string
		| MessageOptions
		| MessageAdditions
		| Promise<string | MessageOptions | MessageAdditions>;

	export type ParsedValuePredicate = (
		message: Message,
		phrase: string,
		value: any
	) => boolean;

	export type PrefixSupplier = (
		message: Message
	) => string | string[] | Promise<string | string[]>;

	export type PromptContentModifier = (
		message: Message,
		text: string,
		data: ArgumentPromptData
	) =>
		| string
		| MessageOptions
		| MessageAdditions
		| Promise<string | MessageOptions | MessageAdditions>;

	export type PromptContentSupplier = (
		message: Message,
		data: ArgumentPromptData
	) =>
		| string
		| MessageOptions
		| MessageAdditions
		| Promise<string | MessageOptions | MessageAdditions>;

	export type RegexSupplier = (message: Message) => RegExp;

	export const Constants: {
		ArgumentMatches: {
			PHRASE: "phrase";
			FLAG: "flag";
			OPTION: "option";
			REST: "rest";
			SEPARATE: "separate";
			TEXT: "text";
			CONTENT: "content";
			REST_CONTENT: "restContent";
			NONE: "none";
		};
		ArgumentTypes: {
			STRING: "string";
			LOWERCASE: "lowercase";
			UPPERCASE: "uppercase";
			CHAR_CODES: "charCodes";
			NUMBER: "number";
			INTEGER: "integer";
			BIGINT: "bigint";
			EMOJINT: "emojint";
			URL: "url";
			DATE: "date";
			COLOR: "color";
			USER: "user";
			USERS: "users";
			MEMBER: "member";
			MEMBERS: "members";
			RELEVANT: "relevant";
			RELEVANTS: "relevants";
			CHANNEL: "channel";
			CHANNELS: "channels";
			TEXT_CHANNEL: "textChannel";
			TEXT_CHANNELS: "textChannels";
			VOICE_CHANNEL: "voiceChannel";
			VOICE_CHANNELS: "voiceChannels";
			CATEGORY_CHANNEL: "categoryChannel";
			CATEGORY_CHANNELS: "categoryChannels";
			NEWS_CHANNEL: "newsChannel";
			NEWS_CHANNELS: "newsChannels";
			STORE_CHANNEL: "storeChannel";
			STORE_CHANNELS: "storeChannels";
			ROLE: "role";
			ROLES: "roles";
			EMOJI: "emoji";
			EMOJIS: "emojis";
			GUILD: "guild";
			GUILDS: "guilds";
			MESSAGE: "message";
			GUILD_MESSAGE: "guildMessage";
			INVITE: "invite";
			MEMBER_MENTION: "memberMention";
			CHANNEL_MENTION: "channelMention";
			ROLE_MENTION: "roleMention";
			EMOJI_MENTION: "emojiMention";
			COMMAND_ALIAS: "commandAlias";
			COMMAND: "command";
			INHIBITOR: "inhibitor";
			LISTENER: "listener";
		};
		AkairoHandlerEvents: {
			LOAD: "load";
			REMOVE: "remove";
		};
		CommandHandlerEvents: {
			MESSAGE_BLOCKED: "messageBlocked";
			MESSAGE_INVALID: "messageInvalid";
			COMMAND_BLOCKED: "commandBlocked";
			COMMAND_STARTED: "commandStarted";
			COMMAND_FINISHED: "commandFinished";
			COMMAND_CANCELLED: "commandCancelled";
			COMMAND_LOCKED: "commandLocked";
			MISSING_PERMISSIONS: "missingPermissions";
			COOLDOWN: "cooldown";
			IN_PROMPT: "inPrompt";
			ERROR: "error";
			SLASH_ERROR: "slashError";
			SLASH_BLOCKED: "slashBlocked";
			SLASH_STARTED: "slashStarted";
			SLASH_NOT_FOUND: "slashNotFound";
			SLASH_GUILD_ONLY: "slashGuildOnly";
			SLASH_MISSING_PERMISSIONS: "slashMissingPermissions";
		};
		BuiltInReasons: {
			CLIENT: "client";
			BOT: "bot";
			OWNER: "owner";
			GUILD: "guild";
			DM: "dm";
		};
	};

	export const version: string;
}
