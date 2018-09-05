function Repl(str, params) {
    const keys = Object.keys(params);

    keys.forEach(k => {
        const regex = new RegExp("\{" + k + " \}");
        str = str.replace(regex, params[k]);
    });

    return str;
}

test('replace', () => {

    const params = {
        foo: "bar"
    }

    const str = "abc {foo} def";

    const out = Repl(str, params);

    expect(out).toBe("abc bar def");
})