import java.util.Random;
import java.util.Scanner;

public class JogoAdivinhacao {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int secreto = new Random().nextInt(100) + 1;
        int tentativas = 0, palpite;

        System.out.println("Adivinhe o número entre 1 e 100!");
        do {
            System.out.print("Seu palpite: ");
            palpite = sc.nextInt();
            tentativas++;
            if (palpite < secreto) System.out.println("Maior!");
            else if (palpite > secreto) System.out.println("Menor!");
        } while (palpite != secreto);

        System.out.println("Acertou em " + tentativas + " tentativas!");
        sc.close();
    }
}
