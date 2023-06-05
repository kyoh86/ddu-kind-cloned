import {
  ActionFlags,
  Actions,
  BaseKind,
} from "https://deno.land/x/ddu_vim@v2.9.2/types.ts";

export type ActionData = {
  path: string;
  url: string;
};

type Modifier =
  "aboveleft|belowright|botright|horizontal|leftabove|rightbelow|tab|topleft|vertical";

type Params = Record<never, never>;

export class Kind extends BaseKind<Params> {
  override actions: Actions<Params> = {
    open: async (args) => {
      const { modifiers } = args.actionParams as { modifiers?: Modifier[] };
      const mod = (modifiers && modifiers.length > 0)
        ? modifiers.join(" ")
        : "";
      const action = args.items[0]?.action as ActionData;
      await args.denops.cmd(`${mod} new ${action.path}`);
      return ActionFlags.None;
    },

    edit: async (args) => {
      const action = args.items[0]?.action as ActionData;
      await args.denops.cmd(`edit ${action.path}`);
      return ActionFlags.None;
    },

    cd: async (args) => {
      const action = args.items[0]?.action as ActionData;
      await args.denops.call("chdir", action.path);
      return ActionFlags.None;
    },

    browse: async (args) => {
      const action = args.items[0]?.action as ActionData;
      await args.denops.call("external#browser", action.url);
      return ActionFlags.None;
    },
  };
  params(): Params {
    return {};
  }
}
