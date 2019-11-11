import { KeyWords } from "./keywords";

// using https://github.com/babel/babylon/blob/master/ast/spec.md as help to design

/** The class all nodes need to inherit from */
export abstract class ASTNode { }

/** Used to defined the Root of the AST */
export class RootNode extends ASTNode {
	constructor(
		public body: ASTNode[] = []
	) {
		super();
	}
}

export abstract class KeywordNode extends ASTNode { }

export abstract class Statement extends ASTNode { }

export abstract class Expression extends ASTNode { }

export abstract class Declaration extends Statement { }

export abstract class LiteralNode extends Expression {
	constructor(
		public readonly value: string
	) {
		super();
	}
}

/** Used for func */
export class FunctionDeclarationNode extends Declaration {
	constructor(
		public readonly key: string /* | undefined */,
		public params: ASTNode[] = []
	) {
		super();
	}
}

/** Used for let/const */
export class DeclarationNode extends Declaration {
	constructor(
		public readonly kind: KeyWords.Const | KeyWords.Let,
		public declarations: VariableNode[] = []
	) {
		super();
	}
}

/**
 * Used for Variable declaration
 * either as a sub-nodes for DeclarationNode
 * or as own things
 */
export class VariableNode extends ASTNode {
	constructor(
		public readonly id: string, // Pattern?
		public readonly init?: Expression
	) {
		super();
	}
}

/** Used for Numbers */
export class NumberNode extends LiteralNode { }

/** Used for String */
export class StringNode extends LiteralNode { }

/** Used for Booleans */
export class BooleanNode extends LiteralNode { }

/** Used for Comments */
export class CommentNode extends ASTNode {
	constructor(
		public readonly value: string
	) {
		super();
	}
}

/** Used for Logical Operations */
export class LogicalExpressionsNode extends Expression {
	constructor(
		public readonly operator: string, // add enum?
		public readonly leftSide: Expression,
		public readonly rightSide: Expression
	) {
		super();
	}
}

/** Used for Math */
export class UnaryExpressionNode extends Expression {
	constructor(
		public readonly operator: string, // add enum?
		public readonly args: Expression
	) {
		super();
	}
}

/** Used for Arrays */
export class ArrayExpressionNode extends Expression {
	constructor(
		public readonly elements: Expression[] = []
	) {
		super();
	}
}
