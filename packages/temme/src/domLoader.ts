/**
 * Browser-native DOM loader.
 * Uses DOMParser to parse HTML and provides a cheerio-compatible API
 * for the subset of methods that temme actually uses.
 */

// Minimal type declarations to avoid requiring "dom" in tsconfig
declare const DOMParser: {
  new (): { parseFromString(string: string, type: string): Document }
}
declare const document: Document

interface NodeLike {
  querySelectorAll(selectors: string): NodeList
  querySelector(selectors: string): Element | null
  nodeType: number
  textContent: string | null
  childNodes: NodeList
}

interface Element extends NodeLike {
  matches(selectors: string): boolean
  getAttribute(name: string): string | null
  innerHTML: string
  outerHTML: string
  parentNode: NodeLike | null
}

interface NodeList {
  length: number
  [index: number]: NodeLike
}

interface Document extends NodeLike {
  documentElement: Element
}

class DomNodeWrapper {
  private nodes: Element[]
  length: number

  constructor(nodes: Element[]) {
    this.nodes = nodes
    this.length = nodes.length
  }

  find(selector: string): DomNodeWrapper {
    const result: Element[] = []
    for (const node of this.nodes) {
      const found = node.querySelectorAll(selector)
      for (let i = 0; i < found.length; i++) {
        result.push(found[i] as Element)
      }
    }
    return new DomNodeWrapper(result)
  }

  first(): DomNodeWrapper {
    return new DomNodeWrapper(this.nodes.length > 0 ? [this.nodes[0]] : [])
  }

  each(fn: (index: number, node: any) => void): DomNodeWrapper {
    for (let i = 0; i < this.nodes.length; i++) {
      fn(i, this.nodes[i])
    }
    return this
  }

  text(): string {
    return this.nodes.map(n => n.textContent || '').join('')
  }

  html(): string {
    if (this.nodes.length === 0) return ''
    return this.nodes[0].innerHTML
  }

  attr(name: string): string | undefined {
    if (this.nodes.length === 0) return undefined
    const value = this.nodes[0].getAttribute(name)
    return value === null ? undefined : value
  }

  is(selector: string): boolean {
    return this.nodes.some(n => (n as Element).matches(selector))
  }

  root(): DomNodeWrapper {
    return new DomNodeWrapper([document.documentElement as Element])
  }
}

function make$(doc: Document): any {
  function $(arg: any): DomNodeWrapper {
    if (typeof arg === 'string') {
      const d = new DOMParser().parseFromString(arg, 'text/html')
      return new DomNodeWrapper([d.documentElement as Element])
    }
    if (arg instanceof DomNodeWrapper) {
      return arg
    }
    return new DomNodeWrapper([arg as Element])
  }
  const rootWrapper = new DomNodeWrapper([doc.documentElement as Element])
  $.root = () => rootWrapper
  return $
}

export function load(html: string): any {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return make$(doc)
}

export default { load }
