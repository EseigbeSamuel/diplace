# Styling guidelines

These rules apply to React Native screens under `app/**`, except files in a
directory whose path contains `components`.

## Rule

Move **static** stylesheet properties to NativeWind `className` values. Keep
properties in `StyleSheet` when the property or value is dynamic, including:

- `RFValue(...)` and other runtime calculations
- theme values such as `colors.slate[...]`, `colors.success`, `colors.warning`,
  `colors.info`, `colors.error`, or `colors.background`
- state, props, variables, dimensions, constants, and platform-dependent
  values
- any other non-static expression

Do not add inline `style={{ ... }}` objects. A component may use `style` for
the remaining dynamic properties held in a `StyleSheet`.

## Examples

```tsx
// Static layout belongs in NativeWind.
<View className="flex-1 flex-row items-center gap-[12px]" />
```

```tsx
// Keep dynamic values in StyleSheet.
const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    title: {
      fontSize: RFValue(20),
      color: colors.slate[650],
    },
  });

<Text style={styles(colors).title}>Title</Text>;
```

```tsx
// Split static and dynamic concerns instead of introducing an inline object.
<View className="rounded-lg p-4" style={styles(colors).card} />;
```

