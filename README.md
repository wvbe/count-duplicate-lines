# count-unique-lines

This is a command-line utility that counts the number of duplicate lines in your streamed input.

Quite plainly, this is the command line equivalent of [this Duplicates in a List Online Tool](https://www.somacon.com/p568.php) by Shailesh N. Humbad.

## installation

```
npm i -g wvbe/count-duplicate-lines
```

## usage

Pipe your lines into this sucker like:

```
cat lines.txt | count-duplicate-lines
```

## options

`-p` or `--porcelain` will send a line- and tab-separated value table, instead of something more readable.