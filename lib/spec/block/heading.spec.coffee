require('jasmine-matchers')
_ = require('lodash')

Config = require('../../src/config.js')
Heading = require('../../src/block/heading.js')

describe 'Heading', ->
  it 'should be defined', ->
    expect(Heading).toBeDefined()
    expect(Heading).not.toBeNull()

describe 'Heading.parser', ->
  parser = Heading.parser(Config.defaults)
  it 'should provide a function', ->
    expect(parser).toBeOfType('function')

  it 'should parse a simple headline', ->
    line = '** Simple headline'
    hl = parser(line)
    expect(hl.title).toBe('Simple headline')
    expect(hl.stars).toBe('**')
    expect(hl.level).toBe(2)
    expect(hl.todo).toBeNull
    expect(hl.priority).toBeNull
    expect(hl.tags).toBeEmpty

  it 'should parse a headline with TODO marker', ->
    line = '** TODO Simple headline'
    hl = parser(line)
    expect(hl.todo).toBe('TODO')

  it 'should parse a headline with priority marker', ->
    line = '** TODO [#B] Simple headline'
    hl = parser(line)
    expect(hl.priority).toBe('B')

  it 'should parse a headline with some tags', ->
    line = '** TODO [#B] Simple headline    :some:tags:'
    hl = parser(line)
    expect(hl.tags.length).toBe(2)
    expect(hl.tags[0]).toBe('some')
    expect(hl.tags[1]).toBe('tags')
